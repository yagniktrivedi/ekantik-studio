import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { format, parse } from 'date-fns';

export async function POST(request: NextRequest) {
  console.log('inside bookings')
  try {
    const body = await request.json();
    const { 
      classId, 
      userId, 
      date, 
      time, 
      location,
      className,
      instructorId 
    } = body;

    if (!classId || !userId || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the user exists
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('*********userData', userData)
    // Check if the class exists
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single();

    if (classError || !classData) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }
    console.log('*******classData', classData)

    // Format the date and time for database storage
    const bookingDate = format(new Date(date), 'yyyy-MM-dd');
    
    // Parse the time to ensure consistent format
    let bookingTime = time;
    if (time.includes('AM') || time.includes('PM')) {
      // Convert from 12-hour format to 24-hour format
      const parsedTime = parse(time, 'hh:mm a', new Date());
      bookingTime = format(parsedTime, 'HH:mm:ss');
    }

    // Check if the user already has a booking for this class on this date and time
    const { data: existingBooking, error: existingBookingError } = await supabase
      .from('class_bookings')
      .select('*')
      .eq('user_id', userId)
      .eq('class_id', classId)
      .eq('booking_date', bookingDate)
      .eq('booking_time', bookingTime)
      .single();

    if (existingBooking) {
      return NextResponse.json(
        { error: 'You have already booked this class' },
        { status: 400 }
      );
    }

    // Check class availability using our database function
    // First, get the class capacity
    const capacity = classData.capacity || 10; // Default to 10 if not specified
    
    // Count the number of confirmed bookings for this class, date, and time
    const { count: bookingsCount, error: countError } = await supabase
      .from('class_bookings')
      .select('*', { count: 'exact' })
      .eq('class_id', classId)
      .eq('booking_date', bookingDate)
      .eq('booking_time', bookingTime)
      .eq('status', 'confirmed');
    
    console.log('Bookings count:', bookingsCount, 'Capacity:', capacity);
    
    // Calculate available spots
    const availableSpots = capacity - (bookingsCount || 0);
    
    if (availableSpots <= 0) {
      // If no spots available, add to waitlist
      // First, get the current waitlist count to determine position
      const { count: waitlistCount, error: waitlistCountError } = await supabase
        .from('class_bookings')
        .select('*', { count: 'exact' })
        .eq('class_id', classId)
        .eq('booking_date', bookingDate)
        .eq('booking_time', bookingTime)
        .eq('status', 'waitlisted');
      
      const waitlistPosition = (waitlistCount || 0) + 1;
      console.log('Waitlist position:', waitlistPosition);
      
      // Create a waitlist booking in the database
      const { data: waitlistBooking, error: waitlistError } = await supabase
        .from('class_bookings')
        .insert({
          user_id: userId,
          class_id: classId,
          booking_date: bookingDate,
          booking_time: bookingTime,
          location: location || 'studio',
          status: 'waitlisted',
          waitlist_position: waitlistPosition,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (waitlistError) {
        console.error('Error adding to waitlist:', waitlistError);
        return NextResponse.json(
          { error: 'Failed to add to waitlist' },
          { status: 500 }
        );
      }
      
      console.log('Added to waitlist:', waitlistBooking);
      
      return NextResponse.json({
        success: true,
        waitlisted: true,
        position: waitlistPosition,
        booking: waitlistBooking
      });
    }
    
    // Create an actual booking in the database
    const { data: booking, error: bookingError } = await supabase
      .from('class_bookings')
      .insert({
        user_id: userId,
        class_id: classId,
        booking_date: bookingDate,
        booking_time: bookingTime,
        location: location || 'studio',
        status: 'confirmed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      );
    }
    
    console.log('Created booking:', booking);

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        classId,
        className: classData.title,
        date: bookingDate,
        time,
        location: booking.location
      }
    });
  } catch (error) {
    console.error('Error in booking API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get all bookings for a user
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const status = searchParams.get('status') || 'confirmed';
  const upcoming = searchParams.get('upcoming') === 'true';

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    // Check if the user exists
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Build the query to get actual bookings from the database
    let query = supabase
      .from('class_bookings')
      .select(`
        *,
        class:classes(*)
      `)
      .eq('user_id', userId);
    
    // Filter by status if provided
    if (status !== 'all') {
      query = query.eq('status', status);
    }
    
    // Filter for upcoming bookings if requested
    if (upcoming) {
      const today = format(new Date(), 'yyyy-MM-dd');
      query = query.gte('booking_date', today);
    }
    
    // Execute the query
    const { data: bookings, error: bookingsError } = await query
      .order('booking_date', { ascending: true })
      .order('booking_time', { ascending: true });
    
    console.log('Retrieved bookings:', bookings?.length || 0);
    
    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    // If no bookings found in the database, return mock data for development
    if (!bookings || bookings.length === 0) {
      // Mock bookings data for development
      const mockBookings = [
        {
          id: 'booking-1',
          user_id: userId,
          class_id: '1',
          booking_date: format(new Date(), 'yyyy-MM-dd'),
          booking_time: '09:00:00',
          location: 'Ekantik Studio',
          status: 'confirmed',
          created_at: new Date().toISOString(),
          class: {
            id: '1',
            title: 'Morning Vinyasa Flow',
            level: 'intermediate',
            duration: 60
          }
        },
        {
          id: 'booking-2',
          user_id: userId,
          class_id: '2',
          booking_date: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'), // Tomorrow
          booking_time: '10:30:00',
          location: 'Ekantik Studio',
          status: 'confirmed',
          created_at: new Date().toISOString(),
          class: {
            id: '2',
            title: 'Gentle Yin Yoga',
            level: 'all-levels',
            duration: 75
          }
        }
      ];

      return NextResponse.json({ bookings: mockBookings });
    }

    // Format the bookings for the response
    const formattedBookings = bookings.map(booking => {
      // Convert booking_time from 24-hour format to 12-hour format for display
      let displayTime = booking.booking_time;
      try {
        if (booking.booking_time && booking.booking_time.includes(':')) {
          const timeParts = booking.booking_time.split(':');
          const hours = parseInt(timeParts[0], 10);
          const minutes = timeParts[1];
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours % 12 || 12;
          displayTime = `${displayHours}:${minutes} ${ampm}`;
        }
      } catch (e) {
        console.error('Error formatting time:', e);
      }

      return {
        ...booking,
        displayTime
      };
    });

    return NextResponse.json({ bookings: formattedBookings });
  } catch (error) {
    console.error('Error in get bookings API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

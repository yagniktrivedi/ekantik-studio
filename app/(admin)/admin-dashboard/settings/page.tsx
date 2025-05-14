"use client";

import { useState } from "react";
import { Settings, Save, User, Mail, Building, Globe, Phone, MapPin, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/auth/auth-provider";

// Define the general settings form schema
const generalFormSchema = z.object({
  studioName: z.string().min(2, { message: "Studio name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Please enter a valid address." }),
  city: z.string().min(2, { message: "Please enter a valid city." }),
  state: z.string().min(2, { message: "Please enter a valid state." }),
  zip: z.string().min(5, { message: "Please enter a valid zip code." }),
  country: z.string().min(2, { message: "Please enter a valid country." }),
  website: z.string().url({ message: "Please enter a valid URL." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
});

// Define the business hours form schema
const hoursFormSchema = z.object({
  mondayOpen: z.string(),
  mondayClose: z.string(),
  mondayClosed: z.boolean().default(false),
  tuesdayOpen: z.string(),
  tuesdayClose: z.string(),
  tuesdayClosed: z.boolean().default(false),
  wednesdayOpen: z.string(),
  wednesdayClose: z.string(),
  wednesdayClosed: z.boolean().default(false),
  thursdayOpen: z.string(),
  thursdayClose: z.string(),
  thursdayClosed: z.boolean().default(false),
  fridayOpen: z.string(),
  fridayClose: z.string(),
  fridayClosed: z.boolean().default(false),
  saturdayOpen: z.string(),
  saturdayClose: z.string(),
  saturdayClosed: z.boolean().default(false),
  sundayOpen: z.string(),
  sundayClose: z.string(),
  sundayClosed: z.boolean().default(true),
});

// Define the notification settings form schema
const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  newBookingNotifications: z.boolean().default(true),
  bookingCancellationNotifications: z.boolean().default(true),
  paymentNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

type GeneralFormValues = z.infer<typeof generalFormSchema>;
type HoursFormValues = z.infer<typeof hoursFormSchema>;
type NotificationFormValues = z.infer<typeof notificationFormSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const { user, role } = useAuth();
  const [isGeneralSaving, setIsGeneralSaving] = useState(false);
  const [isHoursSaving, setIsHoursSaving] = useState(false);
  const [isNotificationSaving, setIsNotificationSaving] = useState(false);

  // Initialize general settings form
  const generalForm = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      studioName: "Ekantik Studio",
      email: "info@ekantikstudio.com",
      phone: "+1 (555) 123-4567",
      address: "123 Yoga Lane",
      city: "Serenity",
      state: "CA",
      zip: "90210",
      country: "United States",
      website: "https://ekantikstudio.com",
      description: "A peaceful sanctuary for yoga and wellness in the heart of the Cotswolds.",
    },
  });

  // Initialize business hours form
  const hoursForm = useForm<HoursFormValues>({
    resolver: zodResolver(hoursFormSchema),
    defaultValues: {
      mondayOpen: "07:00",
      mondayClose: "21:00",
      mondayClosed: false,
      tuesdayOpen: "07:00",
      tuesdayClose: "21:00",
      tuesdayClosed: false,
      wednesdayOpen: "07:00",
      wednesdayClose: "21:00",
      wednesdayClosed: false,
      thursdayOpen: "07:00",
      thursdayClose: "21:00",
      thursdayClosed: false,
      fridayOpen: "07:00",
      fridayClose: "21:00",
      fridayClosed: false,
      saturdayOpen: "08:00",
      saturdayClose: "18:00",
      saturdayClosed: false,
      sundayOpen: "09:00",
      sundayClose: "16:00",
      sundayClosed: false,
    },
  });

  // Initialize notification settings form
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      newBookingNotifications: true,
      bookingCancellationNotifications: true,
      paymentNotifications: true,
      marketingEmails: false,
    },
  });

  // Handle general settings form submission
  const onGeneralSubmit = async (values: GeneralFormValues) => {
    setIsGeneralSaving(true);
    
    try {
      // In a real app, we would save to Supabase here
      console.log("General settings:", values);
      
      setTimeout(() => {
        toast({
          title: "Settings saved",
          description: "Your general settings have been updated successfully.",
        });
        setIsGeneralSaving(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      });
      setIsGeneralSaving(false);
    }
  };

  // Handle business hours form submission
  const onHoursSubmit = async (values: HoursFormValues) => {
    setIsHoursSaving(true);
    
    try {
      // In a real app, we would save to Supabase here
      console.log("Business hours:", values);
      
      setTimeout(() => {
        toast({
          title: "Hours saved",
          description: "Your business hours have been updated successfully.",
        });
        setIsHoursSaving(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving hours:", error);
      toast({
        title: "Error saving hours",
        description: "There was a problem saving your business hours. Please try again.",
        variant: "destructive",
      });
      setIsHoursSaving(false);
    }
  };

  // Handle notification settings form submission
  const onNotificationSubmit = async (values: NotificationFormValues) => {
    setIsNotificationSaving(true);
    
    try {
      // In a real app, we would save to Supabase here
      console.log("Notification settings:", values);
      
      setTimeout(() => {
        toast({
          title: "Notification settings saved",
          description: "Your notification preferences have been updated successfully.",
        });
        setIsNotificationSaving(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast({
        title: "Error saving notification settings",
        description: "There was a problem saving your notification preferences. Please try again.",
        variant: "destructive",
      });
      setIsNotificationSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="w-full border-b pb-0 mb-6">
          <TabsTrigger value="general" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="hours" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Business Hours
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Users & Permissions
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your studio's basic information and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Studio Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={generalForm.control}
                        name="studioName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Studio Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={generalForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Separator />
                    
                    <h3 className="text-lg font-medium">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={generalForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <h3 className="text-lg font-medium">Address</h3>
                    
                    <FormField
                      control={generalForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <FormField
                        control={generalForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="zip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip/Postal Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isGeneralSaving}>
                      {isGeneralSaving ? (
                        <>Saving...</>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>
                Set your studio's operating hours for each day of the week.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...hoursForm}>
                <form onSubmit={hoursForm.handleSubmit(onHoursSubmit)} className="space-y-8">
                  <div className="space-y-6">
                    {[
                      { day: "Monday", open: "mondayOpen", close: "mondayClose", closed: "mondayClosed" },
                      { day: "Tuesday", open: "tuesdayOpen", close: "tuesdayClose", closed: "tuesdayClosed" },
                      { day: "Wednesday", open: "wednesdayOpen", close: "wednesdayClose", closed: "wednesdayClosed" },
                      { day: "Thursday", open: "thursdayOpen", close: "thursdayClose", closed: "thursdayClosed" },
                      { day: "Friday", open: "fridayOpen", close: "fridayClose", closed: "fridayClosed" },
                      { day: "Saturday", open: "saturdayOpen", close: "saturdayClose", closed: "saturdayClosed" },
                      { day: "Sunday", open: "sundayOpen", close: "sundayClose", closed: "sundayClosed" },
                    ].map((item) => (
                      <div key={item.day} className="flex items-center space-x-4">
                        <div className="w-28">
                          <p className="font-medium">{item.day}</p>
                        </div>
                        
                        <FormField
                          control={hoursForm.control}
                          name={item.closed as keyof HoursFormValues}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm">Closed</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <FormField
                            control={hoursForm.control}
                            name={item.open as keyof HoursFormValues}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="sr-only">Opening Time</FormLabel>
                                <FormControl>
                                  <Input
                                    type="time"
                                    {...field}
                                    disabled={hoursForm.watch(item.closed as keyof HoursFormValues)}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={hoursForm.control}
                            name={item.close as keyof HoursFormValues}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="sr-only">Closing Time</FormLabel>
                                <FormControl>
                                  <Input
                                    type="time"
                                    {...field}
                                    disabled={hoursForm.watch(item.closed as keyof HoursFormValues)}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isHoursSaving}>
                      {isHoursSaving ? (
                        <>Saving...</>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Hours
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications from the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Notification Channels</h3>
                    
                    <div className="space-y-4">
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <FormDescription>
                                Receive notifications via email
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="smsNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">SMS Notifications</FormLabel>
                              <FormDescription>
                                Receive notifications via text message
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <h3 className="text-lg font-medium">Notification Types</h3>
                    
                    <div className="space-y-4">
                      <FormField
                        control={notificationForm.control}
                        name="newBookingNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">New Bookings</FormLabel>
                              <FormDescription>
                                Get notified when a new booking is made
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!notificationForm.watch("emailNotifications") && !notificationForm.watch("smsNotifications")}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="bookingCancellationNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Booking Cancellations</FormLabel>
                              <FormDescription>
                                Get notified when a booking is cancelled
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!notificationForm.watch("emailNotifications") && !notificationForm.watch("smsNotifications")}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="paymentNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Payment Notifications</FormLabel>
                              <FormDescription>
                                Get notified about payments and refunds
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!notificationForm.watch("emailNotifications") && !notificationForm.watch("smsNotifications")}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="marketingEmails"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Marketing Emails</FormLabel>
                              <FormDescription>
                                Receive marketing and promotional emails
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!notificationForm.watch("emailNotifications")}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isNotificationSaving}>
                      {isNotificationSaving ? (
                        <>Saving...</>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users & Permissions</CardTitle>
              <CardDescription>
                Manage user accounts and their access levels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center">
                <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">User Management</h3>
                <p className="text-muted-foreground mb-4">
                  This section will allow you to manage user accounts and their permissions.
                </p>
                <Button disabled>Coming Soon</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Connect with third-party services and APIs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center">
                <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Third-Party Integrations</h3>
                <p className="text-muted-foreground mb-4">
                  This section will allow you to connect with payment processors, calendar services, and more.
                </p>
                <Button disabled>Coming Soon</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

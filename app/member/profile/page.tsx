"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera,
  Save
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { RoleGuard } from "@/components/auth/role-guard";

interface ProfileFormData {
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  emergency_contact?: string;
  bio?: string;
  birthdate?: string;
  avatar_url?: string;
}

export default function ProfilePage() {
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    emergency_contact: "",
    bio: "",
    birthdate: "",
    avatar_url: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Fetch user profile data
  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        // Set form data with profile data or defaults from user auth data
        setFormData({
          full_name: data?.full_name || user.user_metadata?.full_name || "",
          email: data?.email || user.email || "",
          phone: data?.phone || user.user_metadata?.phone || "",
          address: data?.address || user.user_metadata?.address || "",
          emergency_contact: data?.emergency_contact || "",
          bio: data?.bio || "",
          birthdate: data?.birthdate || "",
          avatar_url: data?.avatar_url || user.user_metadata?.avatar_url || "",
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: "Error",
          description: "Failed to load your profile. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserProfile();
  }, [user, toast]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (!user) throw new Error("User not authenticated");
      
      // Upload avatar if changed
      let avatarUrl = formData.avatar_url;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filePath, avatarFile);
          
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('profiles')
          .getPublicUrl(filePath);
          
        avatarUrl = urlData.publicUrl;
      }
      
      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          emergency_contact: formData.emergency_contact,
          bio: formData.bio,
          birthdate: formData.birthdate,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        });
        
      if (updateError) throw updateError;
      
      // Update user metadata
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          avatar_url: avatarUrl,
        },
      });
      
      if (authUpdateError) throw authUpdateError;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const userInitials = formData.full_name
    ? formData.full_name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : formData.email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <RoleGuard allowedRoles={["user", "instructor", "admin"]}>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ekantik-600"></div>
          </div>
        ) : (
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="account">Account Settings</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Avatar Section */}
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle>Profile Photo</CardTitle>
                      <CardDescription>Upload a profile picture</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <Avatar className="h-32 w-32">
                          <AvatarImage src={avatarPreview || formData.avatar_url || ""} />
                          <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
                        </Avatar>
                        <label 
                          htmlFor="avatar-upload" 
                          className="absolute bottom-0 right-0 bg-ekantik-600 text-white p-2 rounded-full cursor-pointer hover:bg-ekantik-700 transition-colors"
                        >
                          <Camera className="h-4 w-4" />
                        </label>
                        <input 
                          id="avatar-upload" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleAvatarChange}
                        />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        Click the camera icon to upload a new photo
                      </p>
                    </CardContent>
                  </Card>
                  
                  {/* Personal Information */}
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Textarea
                            id="address"
                            name="address"
                            value={formData.address || ""}
                            onChange={handleChange}
                            className="pl-10 min-h-[80px]"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="birthdate">Date of Birth</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="birthdate"
                            name="birthdate"
                            type="date"
                            value={formData.birthdate || ""}
                            onChange={handleChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="emergency_contact">Emergency Contact</Label>
                        <Input
                          id="emergency_contact"
                          name="emergency_contact"
                          value={formData.emergency_contact || ""}
                          onChange={handleChange}
                          placeholder="Name and phone number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">About Me</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio || ""}
                          onChange={handleChange}
                          placeholder="Tell us a bit about yourself..."
                          className="min-h-[120px]"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isSaving} className="ml-auto">
                        {isSaving ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Update your password to keep your account secure
                    </p>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="email-notifications"
                        className="h-4 w-4 rounded border-gray-300 text-ekantik-600 focus:ring-ekantik-500"
                        defaultChecked
                      />
                      <label htmlFor="email-notifications">
                        Receive email notifications about class bookings and studio updates
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Permanently delete your account and all associated data
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Yoga Preferences</CardTitle>
                  <CardDescription>Tell us about your yoga practice</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Experience Level</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="justify-start">Beginner</Button>
                      <Button variant="outline" className="justify-start bg-ekantik-50">Intermediate</Button>
                      <Button variant="outline" className="justify-start">Advanced</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Preferred Class Types</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <Button variant="outline" className="justify-start bg-ekantik-50">Vinyasa</Button>
                      <Button variant="outline" className="justify-start">Hatha</Button>
                      <Button variant="outline" className="justify-start bg-ekantik-50">Yin</Button>
                      <Button variant="outline" className="justify-start">Power</Button>
                      <Button variant="outline" className="justify-start">Aerial</Button>
                      <Button variant="outline" className="justify-start bg-ekantik-50">Meditation</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Preferred Instructors</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <Button variant="outline" className="justify-start bg-ekantik-50">Maya Johnson</Button>
                      <Button variant="outline" className="justify-start">David Singh</Button>
                      <Button variant="outline" className="justify-start bg-ekantik-50">Sophia Rodriguez</Button>
                      <Button variant="outline" className="justify-start">Alex Williams</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Health Considerations</Label>
                    <Textarea 
                      placeholder="Please share any injuries, health conditions, or special requirements..."
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </RoleGuard>
  );
}

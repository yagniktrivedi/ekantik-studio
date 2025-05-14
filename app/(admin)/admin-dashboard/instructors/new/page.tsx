"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Save,
  ArrowLeft,
  Upload,
  Award,
  Briefcase
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InstructorFormData {
  full_name: string;
  email: string;
  phone: string;
  bio: string;
  specialization: string;
  experience_years: number;
  certifications: string;
  is_active: boolean;
  avatar_url?: string;
}

export default function NewInstructorPage() {
  const [formData, setFormData] = useState<InstructorFormData>({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
    specialization: "",
    experience_years: 0,
    certifications: "",
    is_active: true,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_active: checked }));
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form data
      if (!formData.full_name || !formData.email) {
        throw new Error("Name and email are required");
      }
      
      // First create a user account for the instructor
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: `${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`, // Random password
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: formData.full_name,
          role: 'instructor'
        }
      });
      
      if (userError) {
        // If user already exists, try to get their ID
        if (userError.message.includes('already exists')) {
          const { data: existingUser, error: lookupError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', formData.email)
            .single();
            
          if (lookupError || !existingUser) {
            throw new Error(`Error creating instructor account: ${userError.message}`);
          }
          
          // Continue with existing user ID
          userData = { user: { id: existingUser.id } };
        } else {
          throw new Error(`Error creating instructor account: ${userError.message}`);
        }
      }
      
      const userId = userData?.user?.id;
      if (!userId) {
        throw new Error("Failed to create or find user account");
      }
      
      // Upload avatar if provided
      let avatarUrl = undefined;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `instructor-${userId}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('avatars')
          .upload(fileName, avatarFile, {
            upsert: true,
          });
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: urlData } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(fileName);
        
        avatarUrl = urlData.publicUrl;
      }
      
      // Update or create profile with instructor details
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
          avatar_url: avatarUrl,
          role: 'instructor',
          specialization: formData.specialization,
          experience_years: formData.experience_years,
          certifications: formData.certifications,
          is_active: formData.is_active
        });
      
      if (profileError) {
        throw profileError;
      }
      
      toast({
        title: "Instructor Created",
        description: "The instructor has been successfully added.",
      });
      
      // Redirect to instructors list
      router.push('/admin-dashboard/instructors');
    } catch (error: any) {
      console.error('Error creating instructor:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create instructor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Add New Instructor</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription>
                  Upload a profile photo for the instructor
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="Preview" />
                  ) : (
                    <AvatarFallback>
                      <User className="h-12 w-12 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="flex flex-col items-center">
                  <Label 
                    htmlFor="avatar" 
                    className="cursor-pointer text-sm text-primary flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Label>
                  <Input 
                    id="avatar" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended: Square image, at least 300x300px
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Status</CardTitle>
                <CardDescription>
                  Set the instructor's active status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_active" className="font-medium">Active Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Inactive instructors won't appear in class listings
                    </p>
                  </div>
                  <Switch 
                    id="is_active" 
                    checked={formData.is_active} 
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the instructor's personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="full_name" 
                      name="full_name" 
                      value={formData.full_name} 
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience_years">Years of Experience</Label>
                    <Input 
                      id="experience_years" 
                      name="experience_years" 
                      type="number" 
                      min="0"
                      value={formData.experience_years} 
                      onChange={handleNumberInputChange}
                      placeholder="Enter years of experience"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input 
                    id="specialization" 
                    name="specialization" 
                    value={formData.specialization} 
                    onChange={handleInputChange}
                    placeholder="E.g., Vinyasa Flow, Yin Yoga, Meditation"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications</Label>
                  <Textarea 
                    id="certifications" 
                    name="certifications" 
                    value={formData.certifications} 
                    onChange={handleInputChange}
                    placeholder="List relevant certifications and qualifications"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleInputChange}
                    placeholder="Write a short bio for the instructor"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                className="mr-2"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Instructor
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

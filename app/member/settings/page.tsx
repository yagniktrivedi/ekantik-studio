"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/lib/supabase/client";
import { RoleGuard } from "@/components/auth/role-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  Bell,
  Lock,
  Mail,
  Shield,
  User,
  Smartphone,
  LogOut
} from "lucide-react";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  
  // User settings state
  const [settings, setSettings] = useState({
    email: "",
    phone: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: true,
      classReminders: true,
      promotions: true,
      newsletter: true,
    },
    privacy: {
      showProfile: true,
      shareActivity: false,
    }
  });

  useEffect(() => {
    // In a real app, you would fetch user settings from Supabase
    if (user) {
      setSettings(prev => ({
        ...prev,
        email: user.email || "",
        phone: user.phone || "",
      }));
      
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: checked
      }
    }));
  };

  const handlePrivacyChange = (key: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: checked
      }
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // In a real app, you would update user settings in Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Settings Saved",
        description: "Your account settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Failed to Save",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (settings.newPassword !== settings.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Your new password and confirmation don't match.",
        variant: "destructive",
      });
      return;
    }
    
    if (settings.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Your password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // In a real app, you would update the password in Supabase
      // const { error } = await supabase.auth.updateUser({ password: settings.newPassword });
      // if (error) throw error;
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      
      setSettings(prev => ({
        ...prev,
        password: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
      setIsPasswordDialogOpen(false);
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Password Change Failed",
        description: "There was a problem changing your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsSaving(true);
    
    try {
      // In a real app, you would delete the user account in Supabase
      // const { error } = await supabase.auth.admin.deleteUser(user.id);
      // if (error) throw error;
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
      });
      
      // Sign out the user
      await signOut();
      
      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Deletion Failed",
        description: "There was a problem deleting your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <RoleGuard allowedRoles={["user", "instructor", "admin"]}>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ekantik-600"></div>
          </div>
        ) : (
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
            </TabsList>
            
            {/* Account Settings */}
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your account details and personal information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={settings.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={settings.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleSaveSettings} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your password was last changed 3 months ago. We recommend updating your password regularly for security.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsPasswordDialogOpen(true)}
                    className="w-full"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                  <CardDescription>
                    Permanently delete your account and all of your data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Once you delete your account, there is no going back. This action cannot be undone.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="destructive" 
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="w-full"
                  >
                    Delete Account
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Channels</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={settings.notifications.email}
                          onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-gray-500" />
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                        </div>
                        <Switch
                          id="push-notifications"
                          checked={settings.notifications.push}
                          onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-4 w-4 text-gray-500" />
                          <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        </div>
                        <Switch
                          id="sms-notifications"
                          checked={settings.notifications.sms}
                          onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <Label htmlFor="marketing-emails">Marketing Emails</Label>
                        </div>
                        <Switch
                          id="marketing-emails"
                          checked={settings.notifications.marketing}
                          onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="text-lg font-medium">Notification Types</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between space-x-2">
                        <div>
                          <Label htmlFor="class-reminders" className="block mb-1">Class Reminders</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Get notified about upcoming classes
                          </p>
                        </div>
                        <Switch
                          id="class-reminders"
                          checked={settings.notifications.classReminders}
                          onCheckedChange={(checked) => handleNotificationChange('classReminders', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <div>
                          <Label htmlFor="promotions" className="block mb-1">Promotions</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Special offers and discounts
                          </p>
                        </div>
                        <Switch
                          id="promotions"
                          checked={settings.notifications.promotions}
                          onCheckedChange={(checked) => handleNotificationChange('promotions', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <div>
                          <Label htmlFor="newsletter" className="block mb-1">Newsletter</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Monthly updates and wellness tips
                          </p>
                        </div>
                        <Switch
                          id="newsletter"
                          checked={settings.notifications.newsletter}
                          onCheckedChange={(checked) => handleNotificationChange('newsletter', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Reset to Default</Button>
                  <Button onClick={handleSaveSettings} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Privacy & Security Settings */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control your privacy and what information is visible to others.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label htmlFor="show-profile" className="block mb-1">Profile Visibility</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Allow other members to see your profile
                        </p>
                      </div>
                      <Switch
                        id="show-profile"
                        checked={settings.privacy.showProfile}
                        onCheckedChange={(checked) => handlePrivacyChange('showProfile', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <Label htmlFor="share-activity" className="block mb-1">Activity Sharing</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Share your class attendance with other members
                        </p>
                      </div>
                      <Switch
                        id="share-activity"
                        checked={settings.privacy.shareActivity}
                        onCheckedChange={(checked) => handlePrivacyChange('shareActivity', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSettings} disabled={isSaving} className="w-full">
                    {isSaving ? "Saving..." : "Save Privacy Settings"}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Manage your account security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-400">Security Recommendation</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
                          We recommend enabling two-factor authentication for added security.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="outline" className="w-full" disabled>
                      <Shield className="h-4 w-4 mr-2" />
                      Enable Two-Factor Authentication
                      <span className="ml-2 bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">Coming Soon</span>
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t mt-4">
                    <h4 className="font-medium mb-2">Active Sessions</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Current Device</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Windows • Chrome • {new Date().toLocaleDateString()}
                          </p>
                        </div>
                        <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-1 rounded">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out of All Devices
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        
        {/* Change Password Dialog */}
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your current password and a new password.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={settings.password}
                  onChange={(e) => setSettings(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={settings.newPassword}
                  onChange={(e) => setSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={settings.confirmPassword}
                  onChange={(e) => setSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePasswordChange} disabled={isSaving}>
                {isSaving ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Account Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600 dark:text-red-400">Delete Account</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md mb-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-400">Warning</h4>
                    <p className="text-sm text-red-700 dark:text-red-500 mt-1">
                      Deleting your account will:
                    </p>
                    <ul className="text-sm text-red-700 dark:text-red-500 mt-2 list-disc list-inside">
                      <li>Cancel any active memberships</li>
                      <li>Remove all your personal data</li>
                      <li>Cancel any upcoming class bookings</li>
                      <li>Delete your profile and preferences</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label htmlFor="delete-confirmation">Type "DELETE" to confirm</Label>
                <Input
                  id="delete-confirmation"
                  placeholder="DELETE"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                disabled={isSaving}
              >
                {isSaving ? "Deleting..." : "Permanently Delete Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}

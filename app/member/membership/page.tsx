"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  BarChart4,
  Clock,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { RoleGuard } from "@/components/auth/role-guard";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Mock membership data
const membershipData = {
  id: "mem_123456",
  type: "Monthly Unlimited",
  status: "active",
  startDate: "2025-04-01",
  endDate: "2025-05-01",
  classesRemaining: null,
  autoRenew: true,
  price: 129.99,
  nextBillingDate: "2025-05-01",
  paymentMethod: {
    type: "credit_card",
    last4: "4242",
    brand: "Visa",
    expiryMonth: 12,
    expiryYear: 2027
  }
};

// Mock class usage history
const classHistory = [
  {
    id: "cls_1",
    name: "Vinyasa Flow",
    date: "2025-04-28T10:00:00Z",
    instructor: "Maya Johnson"
  },
  {
    id: "cls_2",
    name: "Gentle Yoga",
    date: "2025-04-25T09:00:00Z",
    instructor: "David Singh"
  },
  {
    id: "cls_3",
    name: "Meditation",
    date: "2025-04-22T07:00:00Z",
    instructor: "David Singh"
  },
  {
    id: "cls_4",
    name: "Power Yoga",
    date: "2025-04-18T18:00:00Z",
    instructor: "Alex Williams"
  },
  {
    id: "cls_5",
    name: "Yin Yoga",
    date: "2025-04-15T19:00:00Z",
    instructor: "Sophia Rodriguez"
  }
];

// Mock membership plans
const membershipPlans = [
  {
    id: "plan_1",
    name: "Monthly Unlimited",
    description: "Unlimited classes for one month",
    price: 129.99,
    classes: "Unlimited",
    duration: "Monthly",
    popular: true
  },
  {
    id: "plan_2",
    name: "10-Class Pack",
    description: "10 classes to use within 3 months",
    price: 180,
    classes: 10,
    duration: "3 months",
    popular: false
  },
  {
    id: "plan_3",
    name: "Annual Membership",
    description: "Unlimited classes for one year (save 20%)",
    price: 1249.99,
    classes: "Unlimited",
    duration: "Annual",
    popular: false
  },
  {
    id: "plan_4",
    name: "5-Class Pack",
    description: "5 classes to use within 2 months",
    price: 95,
    classes: 5,
    duration: "2 months",
    popular: false
  }
];

export default function MembershipPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [membership, setMembership] = useState(membershipData);
  const [usageHistory, setUsageHistory] = useState(classHistory);
  const [plans, setPlans] = useState(membershipPlans);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch membership data
  useEffect(() => {
    // In a real app, you would fetch membership data from Supabase here
    // For now, we'll use the mock data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Calculate days remaining in membership
  const calculateDaysRemaining = () => {
    const endDate = new Date(membership.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Handle membership upgrade
  const handleUpgradeMembership = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    
    try {
      // In a real app, you would make a Supabase call here to upgrade the membership
      // For now, we'll simulate an upgrade
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Membership Upgraded",
        description: `You've successfully upgraded to the ${selectedPlan.name} plan.`,
      });
      
      // Update the membership data
      setMembership({
        ...membership,
        type: selectedPlan.name,
        price: selectedPlan.price,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      
      setIsUpgradeDialogOpen(false);
    } catch (error) {
      console.error('Error upgrading membership:', error);
      toast({
        title: "Upgrade Failed",
        description: "Failed to upgrade your membership. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle membership cancellation
  const handleCancelMembership = async () => {
    setIsProcessing(true);
    
    try {
      // In a real app, you would make a Supabase call here to cancel the membership
      // For now, we'll simulate a cancellation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Membership Cancelled",
        description: "Your membership has been cancelled. You'll still have access until the end of your billing period.",
      });
      
      // Update the membership data
      setMembership({
        ...membership,
        status: "cancelled",
        autoRenew: false,
      });
      
      setIsCancelDialogOpen(false);
    } catch (error) {
      console.error('Error cancelling membership:', error);
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel your membership. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <RoleGuard allowedRoles={["user", "instructor", "admin"]}>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6">My Membership</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ekantik-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Current Membership */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Current Membership</CardTitle>
                    <CardDescription>Your active membership details</CardDescription>
                  </div>
                  <Badge className={
                    membership.status === "active" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }>
                    {membership.status === "active" ? "Active" : "Cancelled"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-ekantik-600 dark:text-ekantik-400">
                        {membership.type}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        ${membership.price}/month
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                        <p className="font-medium">{membership.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">End Date</p>
                        <p className="font-medium">{membership.endDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Auto-Renew</p>
                        <p className="font-medium flex items-center">
                          {membership.autoRenew ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                              Enabled
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                              Disabled
                            </>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Next Billing</p>
                        <p className="font-medium">{membership.nextBillingDate}</p>
                      </div>
                    </div>
                    
                    {membership.paymentMethod && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Payment Method</p>
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="font-medium">
                            {membership.paymentMethod.brand} •••• {membership.paymentMethod.last4}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                            Expires {membership.paymentMethod.expiryMonth}/{membership.paymentMethod.expiryYear}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h4 className="font-medium mb-4">Membership Status</h4>
                    
                    {membership.classesRemaining !== null ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Classes Remaining</span>
                          <span className="font-bold text-xl">{membership.classesRemaining}</span>
                        </div>
                        <Progress value={(membership.classesRemaining / 10) * 100} className="h-2" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Days Remaining</span>
                          <span className="font-bold text-xl">{calculateDaysRemaining()}</span>
                        </div>
                        <Progress 
                          value={(calculateDaysRemaining() / 30) * 100} 
                          className="h-2" 
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Your unlimited membership renews in {calculateDaysRemaining()} days
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-6 space-x-3">
                      <Button 
                        onClick={() => setIsUpgradeDialogOpen(true)}
                        className="w-full mb-3"
                      >
                        Upgrade Membership
                      </Button>
                      {membership.status === "active" && (
                        <Button 
                          variant="outline" 
                          onClick={() => setIsCancelDialogOpen(true)}
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Cancel Membership
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Usage History */}
            <Card>
              <CardHeader>
                <CardTitle>Class Usage History</CardTitle>
                <CardDescription>Your recent class attendance</CardDescription>
              </CardHeader>
              <CardContent>
                {usageHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      You haven't attended any classes yet
                    </p>
                    <Button>Browse Classes</Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-1 divide-y">
                      {usageHistory.map((cls) => (
                        <div key={cls.id} className="p-4 flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{cls.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {cls.instructor} • {new Date(cls.date).toLocaleDateString()} • {new Date(cls.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            Book Again
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All History
                </Button>
              </CardFooter>
            </Card>
            
            {/* Membership Plans */}
            <Card>
              <CardHeader>
                <CardTitle>Available Membership Plans</CardTitle>
                <CardDescription>Explore our membership options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {plans.map((plan) => (
                    <Card key={plan.id} className={`overflow-hidden ${plan.popular ? 'border-ekantik-500 dark:border-ekantik-400' : ''}`}>
                      {plan.popular && (
                        <div className="bg-ekantik-500 text-white text-center py-1 text-sm font-medium">
                          Most Popular
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-4">
                          ${plan.price}
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            /{plan.duration === "Monthly" ? "mo" : plan.duration === "Annual" ? "yr" : "pack"}
                          </span>
                        </div>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                            <span>{plan.classes} classes</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                            <span>Valid for {plan.duration}</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                            <span>Book 7 days in advance</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant={plan.popular ? "default" : "outline"}
                          className="w-full"
                          onClick={() => {
                            setSelectedPlan(plan);
                            setIsUpgradeDialogOpen(true);
                          }}
                        >
                          {plan.name === membership.type ? "Current Plan" : "Select Plan"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Upgrade Dialog */}
        <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
          <DialogContent>
            {selectedPlan && (
              <>
                <DialogHeader>
                  <DialogTitle>Upgrade to {selectedPlan.name}</DialogTitle>
                  <DialogDescription>
                    Confirm your membership upgrade
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Plan Details</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span>{selectedPlan.classes} classes</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span>Valid for {selectedPlan.duration}</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        <span>Book 7 days in advance</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-2">Payment Summary</h4>
                    <div className="flex justify-between mb-2">
                      <span>{selectedPlan.name}</span>
                      <span>${selectedPlan.price}</span>
                    </div>
                    {membership.status === "active" && (
                      <div className="flex justify-between mb-2 text-green-600">
                        <span>Prorated Credit</span>
                        <span>-$25.00</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total Today</span>
                      <span>${membership.status === "active" ? (selectedPlan.price - 25).toFixed(2) : selectedPlan.price}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium">
                        {membership.paymentMethod.brand} •••• {membership.paymentMethod.last4}
                      </span>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUpgradeDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpgradeMembership} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      "Confirm Upgrade"
                    )}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Cancel Dialog */}
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Membership</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your membership?
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md mb-4">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">Important Information</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-500">
                  Your membership will remain active until the end of your current billing period ({membership.endDate}). 
                  After this date, you will no longer have access to member benefits.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Reason for cancellation</h4>
                <select className="w-full p-2 border rounded-md">
                  <option>Please select a reason</option>
                  <option>Too expensive</option>
                  <option>Not using it enough</option>
                  <option>Moving to a different area</option>
                  <option>Switching to a different studio</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                Keep Membership
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancelMembership}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  "Confirm Cancellation"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  );
}

"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real implementation, we would call the Supabase API here
      // const { error } = await supabase
      //   .from('contact_submissions')
      //   .insert([formData]);
      // if (error) throw error;

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Your message has been sent! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pb-16">
        {/* Hero Section */}
        <section className="relative bg-ekantik-50 py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Have questions about our classes, memberships, or anything else? 
                We'd love to hear from you and help you on your yoga journey.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information & Form Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>
                <p className="text-gray-700 mb-8">
                  Feel free to reach out to us using any of the methods below. 
                  We strive to respond to all inquiries within 24 hours during business days.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-ekantik-100 p-3 rounded-full mr-4">
                      <MapPin className="h-6 w-6 text-ekantik-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Studio Location</h3>
                      <p className="text-gray-700">
                        123 Serenity Lane<br />
                        Cotswolds, UK<br />
                        GL54 1AB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-ekantik-100 p-3 rounded-full mr-4">
                      <Phone className="h-6 w-6 text-ekantik-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-700">
                        <a href="tel:+441234567890" className="hover:text-ekantik-600">
                          +44 (0) 1234 567 890
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-ekantik-100 p-3 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-ekantik-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-700">
                        <a href="mailto:info@ekantikstudio.com" className="hover:text-ekantik-600">
                          info@ekantikstudio.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-ekantik-100 p-3 rounded-full mr-4">
                      <Clock className="h-6 w-6 text-ekantik-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Studio Hours</h3>
                      <div className="text-gray-700 space-y-1">
                        <p>Monday - Friday: 6:00 AM - 9:00 PM</p>
                        <p>Saturday: 8:00 AM - 6:00 PM</p>
                        <p>Sunday: 9:00 AM - 4:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="mt-10 bg-gray-200 rounded-lg overflow-hidden h-64">
                  <div className="w-full h-full">
                    {/* In a real implementation, we would embed a Google Maps iframe here */}
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <p className="text-gray-500">Map Embed Placeholder</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Send Us a Message
                </h2>
                <p className="text-gray-700 mb-8">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+44 (0) 1234 567 890"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-ekantik-600 focus:border-transparent"
                        required
                      >
                        <option value="" disabled>Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Membership">Membership</option>
                        <option value="Classes">Classes</option>
                        <option value="Private Sessions">Private Sessions</option>
                        <option value="Workshops">Workshops</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-ekantik-600 hover:bg-ekantik-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-gray-700">
                  Quick answers to common questions
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Do I need to book classes in advance?
                  </h3>
                  <p className="text-gray-700">
                    Yes, we recommend booking classes in advance through our website or mobile app to secure your spot. 
                    Classes can fill up quickly, especially during peak hours.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What should I bring to class?
                  </h3>
                  <p className="text-gray-700">
                    We provide mats and props, but you're welcome to bring your own if you prefer. 
                    We recommend bringing a water bottle and wearing comfortable clothing that allows for movement.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How early should I arrive for class?
                  </h3>
                  <p className="text-gray-700">
                    We recommend arriving 10-15 minutes before your first class to complete any necessary paperwork 
                    and get settled. For returning students, 5-10 minutes is sufficient.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Do you offer private sessions?
                  </h3>
                  <p className="text-gray-700">
                    Yes, we offer private and semi-private sessions with our instructors. 
                    Please contact us directly to inquire about availability and pricing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

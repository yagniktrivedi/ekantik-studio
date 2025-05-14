import { Metadata } from "next";
import Link from "next/link";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/ui/page-header";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import InstructorCard from "@/components/About/InstructorCard";
import { getAllInstructors } from "@/lib/api/classes";
import { InstructorType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Our Instructors | Ekantik Studio",
  description: "Meet our experienced and passionate yoga instructors at Ekantik Studio.",
};

export default async function InstructorsPage() {
  const instructors = await getAllInstructors();

  return (
    <>
      <Navbar />
      <main className="pb-16">
        {/* Hero Section */}
        <section className="relative bg-ekantik-50 py-24 md:py-32">
          <div className="container mx-auto px-4">
            <PageHeader
              title="Our Instructors"
              description="Meet our experienced and passionate teachers dedicated to guiding you on your wellness journey"
            />
          </div>
        </section>

        {/* Instructors Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <div className="mb-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search instructors..." 
                    className="pl-10"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Badge variant="outline" className="bg-ekantik-50 text-ekantik-700 border-ekantik-200">
                    Vinyasa
                  </Badge>
                  <Badge variant="outline" className="bg-ekantik-50 text-ekantik-700 border-ekantik-200">
                    Hatha
                  </Badge>
                  <Badge variant="outline" className="bg-ekantik-50 text-ekantik-700 border-ekantik-200">
                    Meditation
                  </Badge>
                  <Badge variant="outline" className="bg-ekantik-50 text-ekantik-700 border-ekantik-200">
                    Yin
                  </Badge>
                </div>
              </div>
            </div>

            {/* Instructors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {instructors.map((instructor: InstructorType) => (
                <InstructorCard key={instructor.id} instructor={instructor} />
              ))}
            </div>

            {/* Join Our Team CTA */}
            <div className="mt-24 bg-ekantik-50 rounded-lg p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Join Our Teaching Team
                </h2>
                <p className="text-lg text-gray-700 mb-8">
                  Are you a passionate yoga instructor looking to share your practice with our community?
                  We're always interested in connecting with talented teachers who align with our values.
                </p>
                <Button asChild className="bg-ekantik-600 hover:bg-ekantik-700">
                  <Link href="/contact?subject=Teaching Opportunity">Apply to Teach</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Our Students Say
              </h2>
              <p className="text-xl text-gray-700">
                Hear from members of our community about their experiences with our instructors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-ekantik-100 flex items-center justify-center mr-4">
                    <span className="text-ekantik-600 font-bold">JD</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Jane Doe</h3>
                    <p className="text-sm text-gray-500">Member since 2023</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Sarah's vinyasa classes have transformed my practice. Her attention to detail and 
                  personalized adjustments have helped me progress in poses I never thought possible."
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-ekantik-100 flex items-center justify-center mr-4">
                    <span className="text-ekantik-600 font-bold">MS</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Michael Smith</h3>
                    <p className="text-sm text-gray-500">Member since 2022</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "As a complete beginner, I was nervous about starting yoga. Emma's gentle approach 
                  and clear instructions made me feel welcome and confident from day one."
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-ekantik-100 flex items-center justify-center mr-4">
                    <span className="text-ekantik-600 font-bold">RP</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Rachel Patel</h3>
                    <p className="text-sm text-gray-500">Member since 2021</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Michael's power yoga classes are challenging but accessible. His energy is contagious, 
                  and I always leave feeling stronger both physically and mentally."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Teacher Training CTA */}
        <section className="py-16 md:py-24 bg-ekantik-600">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Interested in Becoming a Yoga Teacher?
              </h2>
              <p className="text-xl text-ekantik-100 mb-8">
                Explore our 200-hour and 300-hour Yoga Teacher Training programs led by our senior instructors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-white text-ekantik-600 hover:bg-ekantik-50"
                >
                  <Link href="/teacher-training">Teacher Training Programs</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-ekantik-700"
                >
                  <Link href="/contact?subject=Teacher Training">Request Information</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

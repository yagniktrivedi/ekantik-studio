import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, User, BarChart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import InstructorCard from "@/components/Classes/InstructorCard";
import RelatedClasses from "@/components/Classes/RelatedClasses";
import ClassBookingForm from "@/components/Classes/ClassBookingForm";
import { getClassById } from "@/lib/api/classes";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const classData = await getClassById(params.id);
  
  if (!classData) {
    return {
      title: "Class Not Found | Ekantik Studio",
    };
  }
  
  return {
    title: `${classData.title} | Ekantik Studio`,
    description: classData.description,
  };
}

export default async function ClassDetailPage({ params }: { params: { id: string } }) {
  const classData = await getClassById(params.id);
  
  if (!classData) {
    notFound();
  }
  
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-24 md:py-32">
        <Link href="/classes" className="flex items-center text-ekantik-600 hover:text-ekantik-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Classes
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-6">
              <Image 
                src={classData.image} 
                alt={classData.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge variant="secondary" className="bg-white/90 text-ekantik-900">
                  {classData.category}
                </Badge>
                <Badge variant="secondary" className="bg-ekantik-600/90 text-white">
                  {classData.level}
                </Badge>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-ekantik-900 mb-4">{classData.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2 text-ekantik-600" />
                <span>{classData.duration} minutes</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2 text-ekantik-600" />
                <span>{classData.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="h-5 w-5 mr-2 text-ekantik-600" />
                <span>{classData.instructor.name}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <BarChart className="h-5 w-5 mr-2 text-ekantik-600" />
                <span>{classData.level}</span>
              </div>
            </div>
            
            <div className="prose max-w-none mb-8">
              <h2>Description</h2>
              <p>{classData.description}</p>
              
              <h2>Benefits</h2>
              <ul>
                {classData.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
              
              <h2>What to Bring</h2>
              <ul>
                {classData.whatToBring.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <InstructorCard instructor={classData.instructor} />
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Book This Class</h2>
              <ClassBookingForm classId={params.id} />
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Classes You Might Like</h2>
          <RelatedClasses currentClassId={params.id} category={classData.category} />
        </div>
      </main>
      <Footer />
    </>
  );
}

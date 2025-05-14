import { Metadata } from "next";
import ClassesGrid from "@/components/Classes/ClassesGrid";
import ClassesFilter, { ClassFilterProvider } from "@/components/Classes/ClassesFilter";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import PageHeader from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Yoga Classes | Ekantik Studio",
  description: "Explore our range of yoga classes for all levels at Ekantik Studio.",
};

export default function ClassesPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-24 md:py-32">
        <PageHeader
          title="Our Classes"
          description="Discover our range of yoga and wellness classes designed for all levels and interests."
        />
        
        <ClassFilterProvider>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <ClassesFilter />
            </div>
            <div className="md:col-span-3">
              <ClassesGrid />
            </div>
          </div>
        </ClassFilterProvider>
      </main>
      <Footer />
    </>
  );
}

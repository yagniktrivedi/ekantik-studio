import { Metadata } from "next";
import { useState } from "react";
import Link from "next/link";
import { Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/ui/page-header";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { 
  getAllGalleryImages, 
  getFeaturedGalleryImages,
  getAllGalleryCategories
} from "@/lib/api/gallery";
import { GalleryImageType, GalleryCategoryType } from "@/lib/types/gallery";

export const metadata: Metadata = {
  title: "Gallery | Ekantik Studio",
  description: "Explore photos of our yoga studio, classes, events, and community at Ekantik Studio.",
};

export default async function GalleryPage() {
  const allImages = await getAllGalleryImages();
  const featuredImages = await getFeaturedGalleryImages();
  const categories = await getAllGalleryCategories();
  
  return (
    <>
      <Navbar />
      <main className="pb-16">
        {/* Hero Section */}
        <section className="relative bg-ekantik-50 py-24 md:py-32">
          <div className="container mx-auto px-4">
            <PageHeader
              title="Gallery"
              description="Explore our studio spaces, classes, and community events through images"
            />
            <div className="max-w-xl mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Search gallery..." 
                  className="pl-10 py-6 text-base"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Images Section */}
        {featuredImages.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                Featured Images
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredImages.map((image) => (
                  <div key={image.id} className="group relative overflow-hidden rounded-lg">
                    <div className="aspect-[4/3] bg-gray-100">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h3 className="text-white font-semibold">{image.title}</h3>
                      {image.description && (
                        <p className="text-white/80 text-sm mt-1">{image.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Gallery Tabs Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.slug}>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <TabsContent value="all">
                <GalleryGrid images={allImages} />
              </TabsContent>
              
              {categories.map((category) => (
                <TabsContent key={category.id} value={category.slug}>
                  <GalleryGrid 
                    images={allImages.filter(img => img.category === category.name)} 
                    category={category.name}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Instagram Feed Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Follow Us on Instagram
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Stay connected and see more behind-the-scenes content by following us on Instagram
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Instagram Feed Placeholders */}
              {Array.from({ length: 6 }).map((_, index) => (
                <a 
                  key={index} 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden"
                >
                  <div className="aspect-square bg-gray-200">
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Instagram Post {index + 1}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-ekantik-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-medium">View on Instagram</span>
                  </div>
                </a>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button 
                asChild
                variant="outline" 
                className="border-ekantik-600 text-ekantik-600 hover:bg-ekantik-50"
              >
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Follow @ekantikstudio
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Submit Your Photos CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Share Your Experience
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                We love seeing our community in action! Tag us in your photos or send them directly to be featured in our gallery.
              </p>
              <Button asChild className="bg-ekantik-600 hover:bg-ekantik-700">
                <Link href="/contact?subject=Photo Submission">
                  Submit Your Photos
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Gallery Grid Component
function GalleryGrid({ 
  images, 
  category 
}: { 
  images: GalleryImageType[], 
  category?: string 
}) {
  return (
    <div>
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.id} className="group relative overflow-hidden rounded-lg">
              <div className="aspect-square bg-gray-100">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white font-semibold">{image.title}</h3>
                {image.description && (
                  <p className="text-white/80 text-sm mt-1">{image.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {image.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-white/20 text-white border-transparent">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No images found {category ? `in ${category}` : ''}.</p>
        </div>
      )}
      
      {/* Load More Button */}
      {images.length > 12 && (
        <div className="text-center mt-12">
          <Button variant="outline" className="border-ekantik-600 text-ekantik-600 hover:bg-ekantik-50">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import InstructorCard from "@/components/About/InstructorCard";
import ValueCard from "@/components/About/ValueCard";
import { getAllInstructors } from "@/lib/api/classes";
import { InstructorType } from "@/lib/types";

export default async function AboutPage() {
  const instructors = await getAllInstructors();

  return (
    <>
      <Navbar />
      <main className="pb-16">
        {/* Hero Section */}
        <section className="relative bg-ekantik-50 py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Story
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Ekantik Studio was founded with a simple mission: to create a
                sanctuary where mind, body, and spirit can harmonize through the
                practice of yoga and meditation.
              </p>
              <Button asChild className="bg-ekantik-600 hover:bg-ekantik-700">
                <Link href="/classes">Explore Our Classes</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Our Journey Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Journey
                </h2>
                <p className="text-gray-700 mb-4">
                  Founded in 2015 by Maya Patel, Ekantik Studio began as a small
                  community space dedicated to authentic yoga practices. The name
                  "Ekantik" comes from Sanskrit, meaning "devoted to a single
                  purpose" – reflecting our commitment to helping each individual
                  find their unique path to wellness.
                </p>
                <p className="text-gray-700 mb-4">
                  Over the years, we've grown into a thriving center for holistic
                  wellness, bringing together world-class instructors and a
                  diverse community of practitioners. Our studio has expanded
                  beyond yoga to include meditation, breathwork, and movement
                  practices that honor both ancient traditions and modern
                  research.
                </p>
                <p className="text-gray-700">
                  Today, Ekantik Studio serves thousands of students both
                  in-person and online, while maintaining the intimate,
                  personalized approach that has been our hallmark since day one.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square bg-ekantik-100 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-ekantik-600/20 to-ekantik-800/20"></div>
                  <img
                    src="/images/studio-interior.jpg"
                    alt="Ekantik Studio Interior"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-ekantik-100 rounded-lg overflow-hidden border-4 border-white">
                  <img
                    src="/images/founder.jpg"
                    alt="Maya Patel, Founder"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-700">
                These core principles guide everything we do at Ekantik Studio
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ValueCard
                title="Authenticity"
                description="We honor the ancient traditions of yoga while making them accessible to modern practitioners."
                icon="heart"
              />
              <ValueCard
                title="Inclusivity"
                description="Our studio welcomes all bodies, backgrounds, and experience levels with open arms."
                icon="users"
              />
              <ValueCard
                title="Growth"
                description="We believe in the transformative power of consistent practice and lifelong learning."
                icon="sprout"
              />
            </div>
          </div>
        </section>

        {/* Meet Our Instructors Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Meet Our Instructors
              </h2>
              <p className="text-xl text-gray-700">
                Our team of experienced and passionate teachers is dedicated to
                guiding you on your wellness journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {instructors.map((instructor: InstructorType) => (
                <InstructorCard key={instructor.id} instructor={instructor} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                asChild
                variant="outline"
                className="border-ekantik-600 text-ekantik-600 hover:bg-ekantik-50"
              >
                <Link href="/instructors">View All Instructors</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Our Space Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-ekantik-100 rounded-lg overflow-hidden">
                    <img
                      src="/images/studio-1.jpg"
                      alt="Ekantik Studio Space"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square bg-ekantik-100 rounded-lg overflow-hidden mt-8">
                    <img
                      src="/images/studio-2.jpg"
                      alt="Ekantik Studio Space"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square bg-ekantik-100 rounded-lg overflow-hidden">
                    <img
                      src="/images/studio-3.jpg"
                      alt="Ekantik Studio Space"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square bg-ekantik-100 rounded-lg overflow-hidden mt-8">
                    <img
                      src="/images/studio-4.jpg"
                      alt="Ekantik Studio Space"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Space
                </h2>
                <p className="text-gray-700 mb-4">
                  Located in the heart of the city, our 3,000 square foot studio
                  was designed to be a sanctuary from the hustle and bustle of
                  everyday life. With natural light, sustainable materials, and
                  thoughtful design, our space supports your practice from the
                  moment you walk in.
                </p>
                <p className="text-gray-700 mb-4">
                  We feature two main practice rooms, a meditation space, changing
                  facilities with showers, and a community lounge where you can
                  connect with fellow practitioners before or after class.
                </p>
                <p className="text-gray-700 mb-8">
                  All of our spaces are equipped with premium props and
                  materials to support your practice, regardless of your
                  experience level or physical abilities.
                </p>
                <Button asChild className="bg-ekantik-600 hover:bg-ekantik-700">
                  <Link href="/contact">Visit Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Join Our Community CTA */}
        <section className="py-16 md:py-24 bg-ekantik-600">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Join Our Community
              </h2>
              <p className="text-xl text-ekantik-100 mb-8">
                Whether you're a beginner or an experienced practitioner, there's
                a place for you at Ekantik Studio. Start your journey with us
                today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-white text-ekantik-600 hover:bg-ekantik-50"
                >
                  <Link href="/classes">Browse Classes</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-ekantik-700"
                >
                  <Link href="/memberships">View Memberships</Link>
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

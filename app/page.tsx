import Navbar from "@/components/Layout/Navbar";
import Hero from "@/components/Home/Hero";
import FeaturedClasses from "@/components/Home/FeaturedClasses";
import AboutPreview from "@/components/Home/AboutPreview";
import Testimonials from "@/components/Home/Testimonials";
import MembershipCTA from "@/components/Home/MembershipCTA";
import Newsletter from "@/components/Home/Newsletter";
import Footer from "@/components/Layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedClasses />
        <AboutPreview />
        <Testimonials />
        <MembershipCTA />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

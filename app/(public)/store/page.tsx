import { Metadata } from "next";
import StoreLayout from "@/components/Store/StoreLayout";
import ProductGrid from "@/components/Store/ProductGrid";
import FeaturedProducts from "@/components/Store/FeaturedProducts";
import CategoryFilter from "@/components/Store/CategoryFilter";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import PageHeader from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Store | Ekantik Studio",
  description: "Shop our curated collection of yoga mats, props, clothing, and more at Ekantik Studio.",
};

export default function StorePage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-24 md:py-32">
        <PageHeader
          title="Ekantik Store"
          description="Shop our curated collection of yoga and wellness products to enhance your practice."
        />
        
        <FeaturedProducts />
        
        <StoreLayout>
          <CategoryFilter />
          <ProductGrid />
        </StoreLayout>
      </main>
      <Footer />
    </>
  );
}

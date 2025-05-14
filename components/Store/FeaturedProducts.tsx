"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getFeaturedProducts } from "@/lib/api/store";
import { Product } from "@/lib/types/store";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await getFeaturedProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        toast.error("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="mt-12 mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-ekantik-900">Featured Products</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-ekantik-900">Featured Products</h2>
        <Button asChild variant="ghost" className="text-ekantik-600 hover:text-ekantik-700">
          <Link href="/store" className="flex items-center">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.slice(0, 3).map((product) => (
          <Card key={product.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <Link href={`/store/${product.slug}`} className="block relative">
              <div className="relative h-48 w-full overflow-hidden group">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {product.new && (
                  <Badge className="absolute top-2 left-2 bg-ekantik-600 hover:bg-ekantik-600">
                    New
                  </Badge>
                )}
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-500">
                    Sale
                  </Badge>
                )}
              </div>
            </Link>
            
            <CardContent className="p-4">
              <Link href={`/store/${product.slug}`} className="block">
                <h3 className="text-lg font-semibold text-ekantik-900 mb-2 hover:text-ekantik-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <div className="flex items-center mb-3">
                <span className="font-medium text-gray-900">£{product.price.toFixed(2)}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="ml-2 text-sm text-gray-500 line-through">£{product.compareAtPrice.toFixed(2)}</span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.shortDescription || product.description.substring(0, 100)}
              </p>
            </CardContent>
            
            <CardFooter className="p-4 pt-0 flex gap-2">
              <Button asChild variant="outline" className="w-1/2">
                <Link href={`/store/${product.slug}`}>Details</Link>
              </Button>
              <Button className="w-1/2 bg-ekantik-600 hover:bg-ekantik-700">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

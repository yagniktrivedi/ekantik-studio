"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAllProducts, getProductsByCategory } from "@/lib/api/store";
import { Product, ProductCategory } from "@/lib/types/store";

export default function ProductGrid() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const priceParam = searchParams.get("price");
  const sortParam = searchParams.get("sort");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products based on category filter
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let data: Product[];
        
        if (categoryParam && !categoryParam.includes(",")) {
          // Single category filter
          data = await getProductsByCategory(categoryParam as ProductCategory);
        } else {
          // No category filter or multiple categories
          data = await getAllProducts();
        }
        
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam]);

  // Apply filters and sorting
  useEffect(() => {
    if (!products.length) return;
    
    let result = [...products];
    
    // Filter by categories if multiple categories are selected
    if (categoryParam && categoryParam.includes(",")) {
      const categories = categoryParam.split(",");
      result = result.filter(product => categories.includes(product.category));
    }
    
    // Filter by price ranges
    if (priceParam) {
      const priceRanges = priceParam.split(",");
      result = result.filter(product => {
        const price = product.price;
        
        return priceRanges.some(range => {
          if (range === "0-25") return price <= 25;
          if (range === "25-50") return price > 25 && price <= 50;
          if (range === "50-100") return price > 50 && price <= 100;
          if (range === "100-200") return price > 100 && price <= 200;
          if (range === "200-plus") return price > 200;
          return false;
        });
      });
    }
    
    // Apply sorting
    if (sortParam) {
      switch (sortParam) {
        case "newest":
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case "price-low":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          result.sort((a, b) => b.price - a.price);
          break;
        case "best-selling":
          result.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
          break;
        default:
          result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      }
    } else {
      // Default sort by featured
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    
    setFilteredProducts(result);
  }, [products, categoryParam, priceParam, sortParam]);

  if (loading) {
    return (
      <div className="md:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="h-5 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="md:col-span-3">
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <h3 className="text-xl font-medium text-gray-600">No products found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters or check back later.</p>
          <Button 
            asChild 
            className="mt-4 bg-ekantik-600 hover:bg-ekantik-700"
          >
            <Link href="/store">View All Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="md:col-span-3">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">{filteredProducts.length} products</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
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
                <h3 className="text-lg font-semibold text-ekantik-900 mb-1 hover:text-ekantik-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">({product.reviews.length})</span>
              </div>
              
              <div className="flex items-center mb-3">
                <span className="font-medium text-gray-900">£{product.price.toFixed(2)}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="ml-2 text-sm text-gray-500 line-through">£{product.compareAtPrice.toFixed(2)}</span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.shortDescription || product.description.substring(0, 100)}
              </p>
              
              <Link href={`/store?category=${product.category}`}>
                <Badge variant="outline" className="text-xs capitalize">
                  {product.category.replace('-', ' ')}
                </Badge>
              </Link>
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

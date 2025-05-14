"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Star, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import RelatedProducts from "@/components/Store/RelatedProducts";
import ProductReviews from "@/components/Store/ProductReviews";
import { getProductBySlug } from "@/lib/api/store";
import { Product, ProductVariant } from "@/lib/types/store";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
        
        // Set default variant if variants exist
        if (data?.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product information");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleVariantChange = (variantId: string) => {
    if (product?.variants) {
      const variant = product.variants.find(v => v.id === variantId);
      if (variant) {
        setSelectedVariant(variant);
      }
    }
  };

  const incrementQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.inventory) {
      setQuantity(prev => prev + 1);
    } else if (!selectedVariant) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const addToCart = async () => {
    setIsAddingToCart(true);
    
    try {
      // Simulate API call for adding to cart
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real implementation, we would call the Supabase API here
      // const { data, error } = await supabase
      //   .from('cart_items')
      //   .insert({
      //     product_id: product?.id,
      //     variant_id: selectedVariant?.id,
      //     quantity,
      //     user_id: user?.id
      //   });
      // if (error) throw error;
      
      toast.success("Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-24 md:py-32">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-ekantik-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-gray-600">Loading product details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              We couldn't find the product you're looking for. Please try browsing our store.
            </p>
            <Button asChild className="bg-ekantik-600 hover:bg-ekantik-700">
              <Link href="/store">Browse Store</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayComparePrice = selectedVariant?.compareAtPrice || product.compareAtPrice;
  const isOnSale = displayComparePrice && displayComparePrice > displayPrice;
  const isInStock = selectedVariant ? selectedVariant.inventory > 0 : true;

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-24 md:py-32">
        <Link href="/store" className="flex items-center text-ekantik-600 hover:text-ekantik-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Store
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
              <Image 
                src={product.images[0]} 
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.new && (
                <Badge className="absolute top-4 left-4 bg-ekantik-600 hover:bg-ekantik-600">
                  New
                </Badge>
              )}
              {isOnSale && (
                <Badge className="absolute top-4 right-4 bg-red-500 hover:bg-red-500">
                  Sale
                </Badge>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div key={index} className="relative h-24 rounded-md overflow-hidden cursor-pointer border hover:border-ekantik-600 transition-colors">
                    <Image 
                      src={image} 
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <div className="flex items-center mb-2">
              <Link href={`/store?category=${product.category}`}>
                <Badge variant="outline" className="text-xs capitalize">
                  {product.category.replace('-', ' ')}
                </Badge>
              </Link>
              {product.bestseller && (
                <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs">
                  Bestseller
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.rating} ({product.reviews.length} reviews)</span>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">£{displayPrice.toFixed(2)}</span>
                {isOnSale && (
                  <span className="ml-2 text-lg text-gray-500 line-through">£{displayComparePrice.toFixed(2)}</span>
                )}
              </div>
              {isOnSale && (
                <p className="text-sm text-red-600 mt-1">
                  Save £{(displayComparePrice - displayPrice).toFixed(2)} ({Math.round((displayComparePrice - displayPrice) / displayComparePrice * 100)}% off)
                </p>
              )}
            </div>
            
            <p className="text-gray-600 mb-6">{product.shortDescription || product.description.substring(0, 150) + '...'}</p>
            
            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  {Object.keys(product.variants[0].attributes)[0].charAt(0).toUpperCase() + 
                   Object.keys(product.variants[0].attributes)[0].slice(1)}
                </h3>
                <RadioGroup 
                  value={selectedVariant?.id} 
                  onValueChange={handleVariantChange}
                  className="flex flex-wrap gap-3"
                >
                  {product.variants.map((variant) => {
                    const attributeKey = Object.keys(variant.attributes)[0];
                    const attributeValue = variant.attributes[attributeKey];
                    
                    return (
                      <div key={variant.id} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={variant.id} 
                          id={variant.id} 
                          className="peer sr-only" 
                        />
                        <Label
                          htmlFor={variant.id}
                          className="flex items-center justify-center px-3 py-2 text-sm border rounded-md cursor-pointer peer-data-[state=checked]:border-ekantik-600 peer-data-[state=checked]:bg-ekantik-50 hover:bg-gray-50"
                        >
                          {attributeValue}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            )}
            
            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-r-none"
                >
                  <span className="sr-only">Decrease quantity</span>
                  <span className="text-lg">-</span>
                </Button>
                <div className="h-10 px-4 flex items-center justify-center border-y">
                  {quantity}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={incrementQuantity}
                  disabled={selectedVariant ? quantity >= selectedVariant.inventory : false}
                  className="h-10 w-10 rounded-l-none"
                >
                  <span className="sr-only">Increase quantity</span>
                  <span className="text-lg">+</span>
                </Button>
              </div>
            </div>
            
            {/* Stock Status */}
            <div className="mb-6">
              {isInStock ? (
                <p className="text-sm flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  In Stock
                  {selectedVariant && (
                    <span className="ml-1">
                      ({selectedVariant.inventory} {selectedVariant.inventory === 1 ? 'item' : 'items'} left)
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-sm flex items-center text-red-600">
                  <Info className="h-4 w-4 mr-1" />
                  Out of Stock
                </p>
              )}
            </div>
            
            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                className="flex-1 bg-ekantik-600 hover:bg-ekantik-700"
                onClick={addToCart}
                disabled={isAddingToCart || !isInStock}
              >
                {isAddingToCart ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button variant="outline" className="flex-1">
                Buy Now
              </Button>
            </div>
            
            {/* Product Attributes */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="border rounded-md p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Product Details</h3>
                <dl className="space-y-2">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="flex">
                      <dt className="w-1/3 text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                      <dd className="w-2/3 text-sm text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-6">
              <div className="prose max-w-none">
                <p className="text-gray-600">{product.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-6">
              <ProductReviews reviews={product.reviews} productId={product.id} />
            </TabsContent>
            <TabsContent value="shipping" className="pt-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Information</h3>
                <p className="text-gray-600 mb-4">
                  We offer free standard shipping on all orders over £50 within the UK. 
                  For orders under £50, a flat shipping rate of £4.95 applies.
                </p>
                <p className="text-gray-600 mb-4">
                  Standard shipping typically takes 3-5 business days. 
                  Express shipping is available for an additional fee and typically takes 1-2 business days.
                </p>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2 mt-6">Return Policy</h3>
                <p className="text-gray-600 mb-4">
                  We accept returns within 30 days of delivery for unused and unopened items in their original packaging.
                  To initiate a return, please contact our customer service team.
                </p>
                <p className="text-gray-600">
                  Please note that some items, such as gift cards and digital products, are not eligible for returns.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <RelatedProducts productId={product.id} />
        </div>
      </main>
      <Footer />
    </>
  );
}

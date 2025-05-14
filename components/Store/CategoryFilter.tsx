"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ProductCategory } from "@/lib/types/store";

const categories = [
  { id: "yoga-mats", label: "Yoga Mats" },
  { id: "props", label: "Props & Blocks" },
  { id: "clothing", label: "Clothing" },
  { id: "accessories", label: "Accessories" },
  { id: "books", label: "Books & Journals" },
  { id: "gift-cards", label: "Gift Cards" },
  { id: "digital", label: "Digital Products" },
];

const priceRanges = [
  { id: "0-25", label: "Under £25" },
  { id: "25-50", label: "£25 - £50" },
  { id: "50-100", label: "£50 - £100" },
  { id: "100-200", label: "£100 - £200" },
  { id: "200-plus", label: "£200+" },
];

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "best-selling", label: "Best Selling" },
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState("featured");
  const [priceRange, setPriceRange] = useState<number[]>([0, 200]);
  
  // Initialize filter state from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const priceParam = searchParams.get("price");
    const sortParam = searchParams.get("sort");
    
    if (categoryParam) {
      setSelectedCategories(categoryParam.split(","));
    }
    
    if (priceParam) {
      setSelectedPriceRanges(priceParam.split(","));
    }
    
    if (sortParam) {
      setSelectedSort(sortParam);
    }
  }, [searchParams]);
  
  // Update URL when filters change
  const updateFilters = () => {
    const params = new URLSearchParams();
    
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    }
    
    if (selectedPriceRanges.length > 0) {
      params.set("price", selectedPriceRanges.join(","));
    }
    
    if (selectedSort !== "featured") {
      params.set("sort", selectedSort);
    }
    
    router.push(`/store?${params.toString()}`);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePriceRangeChange = (rangeId: string) => {
    setSelectedPriceRanges(prev => 
      prev.includes(rangeId) 
        ? prev.filter(id => id !== rangeId)
        : [...prev, rangeId]
    );
  };

  const handleSortChange = (sortId: string) => {
    setSelectedSort(sortId);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSelectedSort("featured");
    setPriceRange([0, 200]);
    router.push("/store");
  };

  return (
    <div className="md:col-span-1">
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-ekantik-900">Filters</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="text-sm text-ekantik-600 hover:text-ekantik-700"
          >
            Reset
          </Button>
        </div>

        <Accordion type="multiple" defaultValue={["categories", "price", "sort"]} className="space-y-2">
          <AccordionItem value="categories" className="border-b">
            <AccordionTrigger className="text-sm font-medium py-2">Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.id}`} 
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryChange(category.id)}
                    />
                    <Label 
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price" className="border-b">
            <AccordionTrigger className="text-sm font-medium py-2">Price</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1">
                {priceRanges.map(range => (
                  <div key={range.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`price-${range.id}`} 
                      checked={selectedPriceRanges.includes(range.id)}
                      onCheckedChange={() => handlePriceRangeChange(range.id)}
                    />
                    <Label 
                      htmlFor={`price-${range.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {range.label}
                    </Label>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 px-2">
                <Slider
                  defaultValue={[0, 200]}
                  max={200}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-6"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>£{priceRange[0]}</span>
                  <span>£{priceRange[1]}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sort" className="border-b">
            <AccordionTrigger className="text-sm font-medium py-2">Sort By</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1">
                {sortOptions.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`sort-${option.id}`} 
                      checked={selectedSort === option.id}
                      onCheckedChange={() => handleSortChange(option.id)}
                    />
                    <Label 
                      htmlFor={`sort-${option.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button 
          className="w-full mt-6 bg-ekantik-600 hover:bg-ekantik-700"
          onClick={updateFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}

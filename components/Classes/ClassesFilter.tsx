"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const categories = [
  { id: "hatha", label: "Hatha Yoga" },
  { id: "vinyasa", label: "Vinyasa Flow" },
  { id: "ashtanga", label: "Ashtanga" },
  { id: "yin", label: "Yin Yoga" },
  { id: "restorative", label: "Restorative" },
  { id: "meditation", label: "Meditation" },
];

const levels = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "all-levels", label: "All Levels" },
];

const durations = [
  { id: "30", label: "30 minutes" },
  { id: "45", label: "45 minutes" },
  { id: "60", label: "60 minutes" },
  { id: "75", label: "75 minutes" },
  { id: "90", label: "90 minutes" },
];

const locations = [
  { id: "studio", label: "Ekantik Studio" },
  { id: "online", label: "Online" },
];

// Define the filter context type
export interface ClassFilters {
  categories: string[];
  levels: string[];
  durations: string[];
  locations: string[];
  priceRange: number[];
}

interface ClassFilterContextType {
  filters: ClassFilters;
  setFilter: (key: keyof ClassFilters, value: any) => void;
  resetFilters: () => void;
  isFiltered: boolean;
}

const defaultFilters: ClassFilters = {
  categories: [],
  levels: [],
  durations: [],
  locations: [],
  priceRange: [0, 100],
};

const ClassFilterContext = createContext<ClassFilterContextType | undefined>(undefined);

export function useClassFilters() {
  const context = useContext(ClassFilterContext);
  if (!context) {
    throw new Error("useClassFilters must be used within a ClassFilterProvider");
  }
  return context;
}

interface ClassFilterProviderProps {
  children: ReactNode;
}

export function ClassFilterProvider({ children }: ClassFilterProviderProps) {
  const [filters, setFilters] = useState<ClassFilters>(defaultFilters);

  const setFilter = (key: keyof ClassFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Check if any filters are applied
  const isFiltered = 
    filters.categories.length > 0 || 
    filters.levels.length > 0 || 
    filters.durations.length > 0 || 
    filters.locations.length > 0 || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 100;

  return (
    <ClassFilterContext.Provider value={{ filters, setFilter, resetFilters, isFiltered }}>
      {children}
    </ClassFilterContext.Provider>
  );
}

export default function ClassesFilter() {
  const { filters, setFilter, resetFilters } = useClassFilters();

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    
    setFilter('categories', newCategories);
  };

  const handleLevelChange = (levelId: string) => {
    const newLevels = filters.levels.includes(levelId)
      ? filters.levels.filter(id => id !== levelId)
      : [...filters.levels, levelId];
    
    setFilter('levels', newLevels);
  };

  const handleDurationChange = (durationId: string) => {
    const newDurations = filters.durations.includes(durationId)
      ? filters.durations.filter(id => id !== durationId)
      : [...filters.durations, durationId];
    
    setFilter('durations', newDurations);
  };

  const handleLocationChange = (locationId: string) => {
    const newLocations = filters.locations.includes(locationId)
      ? filters.locations.filter(id => id !== locationId)
      : [...filters.locations, locationId];
    
    setFilter('locations', newLocations);
  };

  const handlePriceChange = (value: number[]) => {
    setFilter('priceRange', value);
  };

  return (
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

      <Accordion type="multiple" defaultValue={["categories", "levels", "duration", "location", "price"]} className="space-y-2">
        <AccordionItem value="categories" className="border-b">
          <AccordionTrigger className="text-sm font-medium py-2">Class Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {categories.map(category => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category.id}`} 
                    checked={filters.categories.includes(category.id)}
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

        <AccordionItem value="levels" className="border-b">
          <AccordionTrigger className="text-sm font-medium py-2">Level</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {levels.map(level => (
                <div key={level.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`level-${level.id}`} 
                    checked={filters.levels.includes(level.id)}
                    onCheckedChange={() => handleLevelChange(level.id)}
                  />
                  <Label 
                    htmlFor={`level-${level.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {level.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="duration" className="border-b">
          <AccordionTrigger className="text-sm font-medium py-2">Duration</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {durations.map(duration => (
                <div key={duration.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`duration-${duration.id}`} 
                    checked={filters.durations.includes(duration.id)}
                    onCheckedChange={() => handleDurationChange(duration.id)}
                  />
                  <Label 
                    htmlFor={`duration-${duration.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {duration.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location" className="border-b">
          <AccordionTrigger className="text-sm font-medium py-2">Location</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-1">
              {locations.map(location => (
                <div key={location.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`location-${location.id}`} 
                    checked={filters.locations.includes(location.id)}
                    onCheckedChange={() => handleLocationChange(location.id)}
                  />
                  <Label 
                    htmlFor={`location-${location.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {location.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className="border-b">
          <AccordionTrigger className="text-sm font-medium py-2">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-6 px-2">
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={5}
                value={filters.priceRange}
                onValueChange={handlePriceChange}
                className="mb-6"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>£{filters.priceRange[0]}</span>
                <span>£{filters.priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full mt-6 bg-ekantik-600 hover:bg-ekantik-700">
        Apply Filters
      </Button>
    </div>
  );
}

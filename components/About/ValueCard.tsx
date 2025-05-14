"use client";

import { Heart, Users, Sprout, Leaf, Compass, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ValueCardProps {
  title: string;
  description: string;
  icon: "heart" | "users" | "sprout" | "leaf" | "compass" | "shield";
}

export default function ValueCard({ title, description, icon }: ValueCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "heart":
        return <Heart className="h-8 w-8 text-ekantik-600" />;
      case "users":
        return <Users className="h-8 w-8 text-ekantik-600" />;
      case "sprout":
        return <Sprout className="h-8 w-8 text-ekantik-600" />;
      case "leaf":
        return <Leaf className="h-8 w-8 text-ekantik-600" />;
      case "compass":
        return <Compass className="h-8 w-8 text-ekantik-600" />;
      case "shield":
        return <Shield className="h-8 w-8 text-ekantik-600" />;
      default:
        return <Heart className="h-8 w-8 text-ekantik-600" />;
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="bg-ekantik-100 p-4 rounded-full mb-6">
          {getIcon()}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </CardContent>
    </Card>
  );
}

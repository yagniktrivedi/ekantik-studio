"use client";

import Image from "next/image";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Tag, 
  Package, 
  Eye 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    status: string;
    featured: boolean;
  };
  onEdit: (product: any) => void;
  onDelete: (product: any) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge className="bg-red-500 hover:bg-red-600">Out of Stock</Badge>;
    }
    if (stock < 5) {
      return <Badge className="bg-orange-500 hover:bg-orange-600">Low Stock</Badge>;
    }
    return <Badge className="bg-green-500 hover:bg-green-600">In Stock</Badge>;
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
        {product.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-purple-500 hover:bg-purple-600">Featured</Badge>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
            £{product.price.toFixed(2)}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-500"
                onClick={() => onDelete(product)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-xs text-gray-600">{product.category}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Package className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-xs text-gray-600">{product.stock} in stock</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        {getStockBadge(product.stock)}
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={() => onEdit(product)}
        >
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}

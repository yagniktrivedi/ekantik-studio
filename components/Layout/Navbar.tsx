"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/classes", label: "Classes" },
    { href: "/schedule", label: "Schedule" },
    { href: "/store", label: "Store" },
    { href: "/about", label: "About" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="h-10 w-10 rounded-full overflow-hidden mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className="w-full h-full">
                <rect className="fill-[#72376e]" x="0" y="0" width="500" height="500"/>
                <g>
                  <path className="stroke-[#fff3d6] fill-none stroke-[15px]" d="M204.4,247.2h0c.13-67.22,36.46-121.01,43.59-130.92.6-.84,1.81-.84,2.41,0,7.13,9.91,43.47,63.69,43.59,130.92h0c0,.06,0,.12,0,.17s0,.12,0,.18h0c-.13,67.56-36.82,121.54-43.7,131.06-.55.76-1.65.76-2.2,0-6.87-9.52-43.57-63.5-43.7-131.06h0c0-.06,0-.12,0-.18s0-.12,0-.17Z"/>
                </g>
              </svg>
            </div>
            <span className={`text-xl font-medium ${isScrolled ? "text-ekantik-900" : "text-ekantik-900"}`}>
              Ekantik Studio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-ekantik-600 bg-ekantik-50"
                    : `${isScrolled ? "text-gray-700 hover:text-ekantik-600 hover:bg-gray-100" : "text-gray-700 hover:text-ekantik-600 hover:bg-white/10"}`
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost" className="text-gray-700 hover:text-ekantik-600">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-ekantik-600 hover:bg-ekantik-700">
              <Link href="/book">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className={`h-6 w-6 ${isScrolled ? "text-gray-700" : "text-gray-700"}`} />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full py-6">
                <Link href="/" className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className="w-full h-full">
                      <rect className="fill-[#72376e]" x="0" y="0" width="500" height="500"/>
                      <g>
                        <path className="stroke-[#fff3d6] fill-none stroke-[15px]" d="M204.4,247.2h0c.13-67.22,36.46-121.01,43.59-130.92.6-.84,1.81-.84,2.41,0,7.13,9.91,43.47,63.69,43.59,130.92h0c0,.06,0,.12,0,.17s0,.12,0,.18h0c-.13,67.56-36.82,121.54-43.7,131.06-.55.76-1.65.76-2.2,0-6.87-9.52-43.57-63.5-43.7-131.06h0c0-.06,0-.12,0-.18s0-.12,0-.17Z"/>
                      </g>
                    </svg>
                  </div>
                  <span className="text-xl font-medium text-ekantik-900">
                    Ekantik Studio
                  </span>
                </Link>
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "text-ekantik-600 bg-ekantik-50"
                          : "text-gray-700 hover:text-ekantik-600 hover:bg-gray-100"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto space-y-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="w-full bg-ekantik-600 hover:bg-ekantik-700">
                    <Link href="/book">Book Now</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

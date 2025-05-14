"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-ekantik-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full overflow-hidden mr-2 bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className="w-full h-full">
                  <rect className="fill-[#72376e]" x="0" y="0" width="500" height="500"/>
                  <g>
                    <path className="stroke-[#fff3d6] fill-none stroke-[15px]" d="M204.4,247.2h0c.13-67.22,36.46-121.01,43.59-130.92.6-.84,1.81-.84,2.41,0,7.13,9.91,43.47,63.69,43.59,130.92h0c0,.06,0,.12,0,.17s0,.12,0,.18h0c-.13,67.56-36.82,121.54-43.7,131.06-.55.76-1.65.76-2.2,0-6.87-9.52-43.57-63.5-43.7-131.06h0c0-.06,0-.12,0-.18s0-.12,0-.17Z"/>
                  </g>
                </svg>
              </div>
              <span className="text-xl font-medium">Ekantik Studio</span>
            </div>
            <p className="text-gray-300 text-sm">
              Discover the transformative power of yoga and wellness at Ekantik Studio in the beautiful Cotswolds.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Youtube size={20} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/classes" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Classes
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Store
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 text-sm">
                123 Yoga Lane, Cotswolds, UK
              </li>
              <li>
                <a href="tel:+441234567890" className="text-gray-300 hover:text-white transition-colors text-sm">
                  +44 1234 567890
                </a>
              </li>
              <li>
                <a href="mailto:info@ekantikstudio.com" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center">
                  <Mail size={16} className="mr-1" />
                  info@ekantikstudio.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Newsletter</h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-ekantik-800 border-ekantik-700 text-white placeholder:text-gray-400"
              />
              <Button className="bg-ekantik-600 hover:bg-ekantik-500">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-ekantik-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Ekantik Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

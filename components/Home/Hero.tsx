"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);
  
  return (
    <section className="relative">
      <div className="bg-ekantik-100 py-12 md:py-32">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0 animate-fade-in">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-ekantik-900 mb-4 leading-tight">
              Find Your Path to <span className="text-ekantik-600 font-normal">Inner Peace</span>
            </h1>
            <p className="text-base md:text-xl text-gray-600 mb-6 max-w-lg mx-auto md:mx-0">
              Discover the transformative power of yoga and wellness at Ekantik Studio in the beautiful Cotswolds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size={isMobile ? "default" : "lg"} className="bg-ekantik-600 hover:bg-ekantik-700 text-white transform transition hover:scale-105 duration-300 w-full sm:w-auto">
                <Link href="/book">Book a Class</Link>
              </Button>
              <Button asChild size={isMobile ? "default" : "lg"} variant="outline" className="border-ekantik-600 text-ekantik-600 hover:bg-ekantik-50 transform transition hover:scale-105 duration-300 w-full sm:w-auto">
                <Link href="/classes">Explore Classes</Link>
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center md:justify-end animate-scale-in w-full">
            <div className="relative h-[250px] md:h-[400px] w-full max-w-sm md:max-w-md rounded-lg overflow-hidden transform transition hover:scale-105 duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-ekantik-500/30 to-ekantik-700/30"></div>
              <div 
                className="h-full w-full bg-cover bg-center" 
                style={{backgroundImage: "url('https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80')"}}
              ></div>
              <div className="absolute bottom-0 right-0 p-4">
                <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white/80 shadow-lg animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className="w-full h-full">
                    <rect className="fill-[#72376e]" x="0" y="0" width="500" height="500"/>
                    <g>
                      <path className="stroke-[#fff3d6] fill-none stroke-[5px]" d="M204.4,247.2h0c.13-67.22,36.46-121.01,43.59-130.92.6-.84,1.81-.84,2.41,0,7.13,9.91,43.47,63.69,43.59,130.92h0c0,.06,0,.12,0,.17s0,.12,0,.18h0c-.13,67.56-36.82,121.54-43.7,131.06-.55.76-1.65.76-2.2,0-6.87-9.52-43.57-63.5-43.7-131.06h0c0-.06,0-.12,0-.18s0-.12,0-.17Z"/>
                      <path className="stroke-[#fff3d6] fill-none stroke-[5px]" d="M265.47,283.68h0c23.48-40.57,67.03-58.78,75.35-61.96.7-.27,1.53.21,1.65.95,1.42,8.79,7.53,55.6-15.78,96.27h0s-.04.07-.06.11-.04.07-.06.11h0c-23.6,40.78-67.47,58.96-75.48,62.01-.64.24-1.39-.19-1.51-.87-1.38-8.46-7.67-55.52,15.76-96.4h0s.04-.07.06-.11.04-.07.06-.11Z"/>
                      <path className="stroke-[#fff3d6] fill-none stroke-[5px]" d="M230.26,285.47h0c-25.49-39.35-68.75-56.09-76.99-59-.7-.25-1.46.25-1.52.98-.75,8.71-3.35,55.02,21.98,94.48h0s.05.07.07.1.04.07.06.1h0c25.62,39.55,69.18,56.26,77.12,59.04.64.22,1.33-.22,1.39-.9.74-8.38,3.49-54.95-21.97-94.61h0s-.05-.07-.07-.1-.04-.07-.06-.1Z"/>
                      <path className="stroke-[#fff3d6] fill-none stroke-[5px]" d="M197.61,329.63h0c-31.77-15.84-65.93-11.07-72.33-9.98-.54.09-.83.67-.58,1.16,2.96,5.78,19.6,35.99,51.31,51.95h0s.06.03.08.04.05.03.08.04h0c31.93,15.92,66.27,11.02,72.42,9.97.49-.08.76-.61.53-1.06-2.84-5.56-19.48-35.99-51.35-52.03h0s-.06-.03-.08-.04-.05-.03-.08-.04Z"/>
                      <path className="stroke-[#fff3d6] fill-none stroke-[5px]" d="M302.39,329.63h0c31.77-15.84,65.93-11.07,72.33-9.98.54.09.83.67.58,1.16-2.96,5.78-19.6,35.99-51.31,51.95h0s-.06.03-.08.04-.05.03.08.04h0c-31.93,15.92-66.27,11.02-72.42,9.97-.49-.08-.76-.61.53-1.06,2.84-5.56,19.48-35.99,51.35-52.03h0s.06-.03.08-.04.05-.03.08-.04Z"/>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;

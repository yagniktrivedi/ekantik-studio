"use client";

import { ReactNode } from "react";

interface StoreLayoutProps {
  children: ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
      {children}
    </div>
  );
}

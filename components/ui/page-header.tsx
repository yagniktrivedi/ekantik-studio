import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <div className={cn("text-center max-w-3xl mx-auto", className)}>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ekantik-900 mb-4">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;

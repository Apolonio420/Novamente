"use client";

import { ReactNode } from "react";
import { Wand2 } from "lucide-react";

interface GeneratorLayoutProps {
  children: ReactNode;
  inputs: ReactNode;
  title: string;
}

export function GeneratorLayout({ children, inputs, title }: GeneratorLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="md:w-1/3 border-r">
        <div className="sticky top-0 p-4">
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
          {inputs}
        </div>
      </div>
      
      <div className="md:w-2/3">
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
} 
"use client";

import { ReactNode } from "react";
import { Wand2 } from "lucide-react";

interface GeneratorLayoutProps {
  inputs: ReactNode;
  children: ReactNode;
  title: string;
}

export function GeneratorLayout({ inputs, children }: GeneratorLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        <aside className="w-full md:w-[400px] border-l bg-white overflow-y-auto">
          {inputs}
        </aside>
      </div>
      {/* Botón "Generar" fijo en la parte inferior derecha */}
      <button
        className="fixed bottom-4 right-4 z-[65] justify-center whitespace-nowrap text-sm font-medium
        bg-black text-white hover:bg-gray-900 rounded-full px-6 py-2 flex items-center gap-2 shadow-lg"
      >
        <Wand2 className="w-5 h-5" />
        <span>Generar</span>
      </button>
    </div>
  );
} 
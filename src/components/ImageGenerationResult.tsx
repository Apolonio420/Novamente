"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageModal } from "./ImageModal";
import { cn } from "@/lib/utils";

interface ImageGenerationResultProps {
  imageUrl: string;
}

export function ImageGenerationResult({ imageUrl }: ImageGenerationResultProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (imageUrl) {
      // Agregar un pequeño delay para asegurarnos que la imagen esté lista
      const timer = setTimeout(() => {
        fetch(imageUrl, { method: 'HEAD' })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Error al cargar la imagen: ${response.status}`);
            }
            setIsLoading(false);
            setError(null);
          })
          .catch(err => {
            console.error("Error loading image:", err);
            setIsLoading(false);
            setError("Error al cargar la imagen. Por favor, intenta de nuevo.");
          });
      }, 2000); // 2 segundos de delay

      return () => clearTimeout(timer);
    }
  }, [imageUrl]);

  if (!imageUrl) {
    return null;
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        {error}
        <button 
          onClick={() => window.location.reload()} 
          className="ml-2 underline"
        >
          Recargar
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        className="relative w-full aspect-square cursor-pointer overflow-hidden rounded-lg"
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src={imageUrl}
          alt="Imagen generada"
          fill
          className={cn(
            "object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoadingComplete={() => setIsLoading(false)}
          unoptimized // Para URLs externas
          onError={() => {
            setError("Error al cargar la imagen. Por favor, intenta de nuevo.");
            setIsLoading(false);
          }}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ImageModal
          imageUrl={imageUrl}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}


"use client";

import { LoadingIcon } from "@/components/LoadingIcon";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { X } from "lucide-react";
import { createPortal } from 'react-dom';

interface ImageGenerationResultProps {
  runId: string;
  className?: string;
  initialStatus?: string;
  initialImageUrl?: string;
  onClick?: () => void;
}

export function ImageGenerationResult({ 
  runId, 
  className, 
  initialStatus,
  initialImageUrl,
  onClick 
}: ImageGenerationResultProps) {
  const [image, setImage] = useState(initialImageUrl || "");
  const [status, setStatus] = useState<string>(initialStatus || "queued");
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(!initialImageUrl);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!runId || initialImageUrl) return;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/status/${runId}`);
        const data = await response.json();
        
        if (data.live_status) {
          setStatus(data.live_status);
          setProgress(data.progress || 0);

          if (data.live_status === "error") {
            console.error("Generation failed:", data);
            return true;
          }
        }

        if (data.image_url) {
          setImage(data.image_url);
          setLoading(false);
          setStatus("completed");
          return true;
        }

        return false;
      } catch (error) {
        console.error("[Status Check] Error:", error);
        if (retryCount > 3) {
          setStatus("error");
          return true;
        }
        setRetryCount(prev => prev + 1);
        return false;
      }
    };

    const interval = setInterval(async () => {
      const shouldStop = await checkStatus();
      if (shouldStop) {
        clearInterval(interval);
      }
    }, 2000);

    checkStatus();

    return () => clearInterval(interval);
  }, [runId, initialImageUrl, retryCount]);

  // Función para manejar el cierre del modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Asegurarnos de limpiar cualquier estado residual
    document.body.style.overflow = 'auto';
  };

  // Función para manejar la apertura del modal
  const handleOpenModal = () => {
    if (!isModalOpen) {
      setIsModalOpen(true);
      if (onClick) onClick();
    }
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    return createPortal(
      <div 
        className="fixed inset-0 z-[999999] flex items-center justify-center"
        onClick={handleCloseModal}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
        
        <div className="relative z-10 p-6 max-w-[85vw] max-h-[85vh]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCloseModal();
            }}
            className="absolute -top-10 right-2 text-white/90 hover:text-white transition-all p-2"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src={image}
            alt="Vista completa"
            className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>,
      document.body
    );
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden w-full aspect-[512/512] relative",
        className
      )}
    >
      {!loading && image && (
        <button 
          className="w-full h-full"
          onClick={handleOpenModal}
        >
          <img 
            src={image} 
            alt="Generated image" 
            className="w-full h-full object-cover"
          />
        </button>
      )}
      {!image && (
        <div className="absolute z-10 top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-2 px-4">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            {status === "queued" && "En cola..."}
            {status === "processing" && "Procesando..."}
            {status === "completed" && "¡Completado!"}
            {status === "error" && "¡Ocurrió un error!"}
            <LoadingIcon />
          </div>
          <Progress value={progress * 100} className="h-[2px] w-full" />
          <span className="text-sm text-center text-gray-400">
            {progress > 0 && `${Math.round(progress * 100)}%`}
          </span>
        </div>
      )}
      {loading && !image && <Skeleton className="w-full h-full" />}

      {renderModal()}
    </Card>
  );
}


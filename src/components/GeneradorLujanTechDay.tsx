"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { ImageUpload } from "./ImageUpload";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { mutate } from "swr";
import { CollapsibleGeneratorForm } from "./CollapsibleGeneratorForm";

export function GeneradorLujanTechDay() {
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");
  const [email, setEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imagen) {
      toast.error("Por favor carga una selfie");
      return;
    }

    if (!nombre || !email) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-personalizado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          imagen,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al generar la imagen");
      }

      toast.success("¡Generación iniciada!");
      mutate("userRuns");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <CollapsibleGeneratorForm>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Tu Selfie</Label>
          <ImageUpload
            value={imagen}
            onChange={(url) => {
              setImagen(url);
              toast.success("Imagen cargada con éxito");
            }}
            accept="image/*"
            showPreview={!isMobile}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre completo"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isGenerating}
          onClick={handleSubmit}
        >
          {isGenerating ? "Generando..." : "Generar"}
        </Button>
      </div>
    </CollapsibleGeneratorForm>
  );
} 
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ImageGenerationResult } from "./ImageGenerationResult";

interface GeneradorPersonalizadoProps {
  // ... otras props
}

export function GeneradorPersonalizado({ /* props */ }: GeneradorPersonalizadoProps) {
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");
  const [email, setEmail] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Generar imagen con ComfyDeploy
      const response = await fetch("/api/generate-personalizado", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      setRunId(data.runId);
      // Construir la URL de la imagen basada en el runId
      setImageUrl(`https://comfy-deploy-output.s3.us-east-2.amazonaws.com/outputs/runs/${data.runId}/image.png`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Nombre
            </label>
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingresa un nombre"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Imagen
            </label>
            <Input
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              placeholder="Describe la imagen"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <Button type="submit" className="w-full">
            Generar
          </Button>
        </form>
      </Card>

      <div>
        {imageUrl && (
          <ImageGenerationResult
            imageUrl={imageUrl}
            className="w-full"
          />
        )}
      </div>
    </div>
  );
} 
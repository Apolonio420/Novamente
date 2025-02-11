"use client";

import { GeneratorLayout } from "@/components/GeneratorLayout";
import { UserRuns } from "@/components/UserRuns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { Wand2 } from "lucide-react";

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error("Por favor ingresa un prompt");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deploymentId: "e322689e-065a-4d33-aa6a-ee941803ca95",
          prompt: prompt,
          height: 1024,
          width: 768,
          lora: ""
        }),
      });

      const result = await response.json();
      if (response.ok && result.run_id) {
        toast.success("¡Generación iniciada!");
        mutate("userRuns");
      } else {
        toast.error(result.error || "Error al generar la imagen");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al generar la imagen");
    } finally {
      setIsGenerating(false);
    }
  };

  const inputs = (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Prompt de la imagen</Label>
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe la imagen que quieres generar"
        />
      </div>

      <Button 
        className="w-full gap-2" 
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        <Wand2 className="w-4 h-4" />
        {isGenerating ? "Generando..." : "Generar Imagen"}
      </Button>
    </div>
  );

  return (
    <GeneratorLayout 
      inputs={inputs}
      title="Generador de Imágenes"
    >
      <UserRuns deploymentId="e322689e-065a-4d33-aa6a-ee941803ca95" />
    </GeneratorLayout>
  );
} 
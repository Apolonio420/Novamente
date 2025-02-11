"use client";

import React from 'react';
import { GeneratorLayout } from "@/components/GeneratorLayout";
import { UserRuns } from "@/components/UserRuns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CollapsibleGeneratorForm } from "@/components/CollapsibleGeneratorForm";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { Wand2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function BasicGeneratorPage() {
  const [formData, setFormData] = useState({
    prompt: "",
    height: 1152,
    width: 896,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!formData.prompt.trim()) {
      toast.error("Por favor ingresa un prompt");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          deploymentId: "e322689e-065a-4d33-aa6a-ee941803ca95"
        }),
      });

      const result = await response.json();
      if (response.ok && result.run_id) {
        toast.success("¡Generación iniciada!");
        mutate("userRuns");
      } else {
        console.error("Generation failed:", result);
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
    <Card className="rounded-none border-0 p-4">
      <CollapsibleGeneratorForm>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Input 
              id="prompt"
              value={formData.prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="Describe lo que quieres generar..."
              className="w-full p-3 bg-secondary text-white rounded-md border border-primary focus:outline-none"
            />
          </div>
          <div className="flex space-x-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input 
                id="width"
                type="number"
                value={formData.width}
                onChange={(e) => setFormData(prev => ({ ...prev, width: parseInt(e.target.value) || 896 }))}
                className="w-full p-3 bg-secondary text-white rounded-md border border-primary focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input 
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: parseInt(e.target.value) || 1152 }))}
                className="w-full p-3 bg-secondary text-white rounded-md border border-primary focus:outline-none"
              />
            </div>
          </div>
          <Button 
            className="w-full bg-primary text-white py-3 rounded-md hover:bg-accent"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Generando..." : "Generar"}
          </Button>
        </form>
      </CollapsibleGeneratorForm>
    </Card>
  );

  const generateButton = (
    <Button className="gap-2 rounded-full">
      <Wand2 className="w-4 h-4" />
      Generar
    </Button>
  );

  return (
    <GeneratorLayout 
      inputs={inputs}
      title="Generador Básico"
    >
      <UserRuns />
    </GeneratorLayout>
  );
} 
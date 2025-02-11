"use client";

import { GeneratorLayout } from "@/components/GeneratorLayout";
import { UserRuns } from "@/components/UserRuns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { Wand2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AdvancedGeneratorPage() {
  const [formData, setFormData] = useState({
    prompt: "",
    height: 1152,
    width: 896,
    lora: "",
    lora_strength: 0.5
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
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok && result.run_id) {
        toast.success("¡Generación de imagen iniciada!");
        mutate("userRuns");
      } else {
        toast.error("Fallo al iniciar la generación de imagen.");
      }
    } catch (error) {
      console.error("Error generando imagen:", error);
      toast.error("Ocurrió un error al generar la imagen.");
    } finally {
      setIsGenerating(false);
    }
  };

  const inputs = (
    <Card className="rounded-none border-0 p-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="prompt">Prompt</Label>
          <Input 
            id="prompt"
            value={formData.prompt}
            onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
            placeholder="Describe lo que quieres generar..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="width">Width</Label>
          <Input 
            id="width"
            type="number"
            value={formData.width}
            onChange={(e) => setFormData(prev => ({ ...prev, width: parseInt(e.target.value) || 896 }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input 
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => setFormData(prev => ({ ...prev, height: parseInt(e.target.value) || 1152 }))}
          />
        </div>
        <div className="space-y-2">
          <Label>LoRA</Label>
          <select
            value={formData.lora}
            onChange={(e) => setFormData(prev => ({ ...prev, lora: e.target.value }))}
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            <option value="">Sin LoRA</option>
            <option value="flux-RealismLora.safetensors">Realism LoRA</option>
          </select>
        </div>
        {formData.lora && (
          <div className="space-y-2">
            <Label>Lora Strength</Label>
            <Slider 
              value={[formData.lora_strength]}
              onValueChange={([value]) => setFormData(prev => ({ ...prev, lora_strength: value }))}
              max={1} 
              step={0.1}
            />
          </div>
        )}
        <Button 
          className="w-full" 
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? "Generando..." : "Generar"}
        </Button>
      </div>
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
      title="Generador Avanzado"
    >
      <UserRuns />
    </GeneratorLayout>
  );
} 
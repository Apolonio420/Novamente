"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export const ShirtMockupEditor = ({ imageUrl, onClose }: { imageUrl: string, onClose: () => void }) => {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const removeBackground = async () => {
      try {
        const response = await fetch('/api/remove-bg', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl })
        });
        
        const { processedUrl } = await response.json();
        setProcessedImage(processedUrl);
      } catch (error) {
        console.error('Error removing background:', error);
      }
    };

    removeBackground();
  }, [imageUrl]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4">Editar diseño de remera</h2>
        
        <div className="relative mx-auto w-80 h-96">
          {/* Mockup de remera */}
          <div className="absolute inset-0 bg-[url('/shirt-mockup.png')] bg-contain bg-no-repeat" />
          
          {/* Imagen del usuario */}
          {processedImage && (
            <div
              className="absolute"
              style={{
                transform: `translate(${position.x}%, ${position.y}%) scale(${scale})`,
                width: '40%',
                height: '40%',
                left: '30%',
                top: '30%'
              }}
            >
              <img
                src={processedImage}
                alt="Design"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block mb-2">Tamaño</label>
            <Slider
              value={[scale]}
              min={0.5}
              max={2}
              step={0.1}
              onValueChange={([value]) => setScale(value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Posición X</label>
              <Slider
                value={[position.x]}
                min={0}
                max={100}
                onValueChange={([x]) => setPosition(p => ({ ...p, x }))}
              />
            </div>
            <div>
              <label className="block mb-2">Posición Y</label>
              <Slider
                value={[position.y]}
                min={0}
                max={100}
                onValueChange={([y]) => setPosition(p => ({ ...p, y }))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={() => console.log('Guardar diseño', { processedImage, scale, position })}>
              Guardar diseño
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 
"use client";

import { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { Upload, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, accept, className }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/file/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al subir la imagen");
      }

      onChange(data.file_url);
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Error al subir la imagen");
    } finally {
      setLoading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const fakeEvent = {
          target: {
            files: [file],
            value: '',
            name: 'file',
            type: 'file',
            validity: {
              valid: true
            },
            validationMessage: '',
            nodeType: 1,
            tagName: 'INPUT'
          } as HTMLInputElement,
          preventDefault: () => {},
          stopPropagation: () => {},
          nativeEvent: new Event('change'),
          currentTarget: null,
          bubbles: true,
          cancelable: true,
          defaultPrevented: false,
          eventPhase: 0,
          isTrusted: true,
          timeStamp: Date.now(),
          type: 'change',
          isDefaultPrevented: () => false,
          isPropagationStopped: () => false,
          persist: () => {}
        } as React.ChangeEvent<HTMLInputElement>;

        onFileChange(fakeEvent);
      }
    },
    accept: accept,
  });

  const open = () => {
    // Implementation of open function
  };

  return (
    <div className="space-y-4">
      {/* Botón de carga */}
      <div 
        {...getRootProps()}
        className={cn(
          "group relative mt-8 grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-gray-400",
          isDragActive && "border-blue-500",
          className
        )}
      >
        <input {...getInputProps()} />
        
        <Button 
          type="button" 
          onClick={() => open()}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Subir imagen
        </Button>
      </div>

      {/* Previsualización de la imagen */}
      {value && (
        <div className="relative w-32 h-32 mx-auto overflow-hidden rounded-lg border">
          <Image
            src={value}
            alt="Vista previa"
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
} 
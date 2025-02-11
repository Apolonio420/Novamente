"use client";

import * as React from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from './ui/button';
import { X, Wand2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CollapsibleGeneratorFormProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CollapsibleGeneratorForm({ 
  children, 
  isOpen, 
  onOpenChange 
}: CollapsibleGeneratorFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const open = isOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      console.log('isMobile:', mobile);
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  console.log('open:', open);

  if (!isMobile) {
    return <div className="space-y-6">{children}</div>;
  }

  return (
    <Collapsible>
      <CollapsibleTrigger className="w-full">Opciones avanzadas</CollapsibleTrigger>
      <CollapsibleContent className="pt-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
} 
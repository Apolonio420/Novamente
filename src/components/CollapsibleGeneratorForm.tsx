import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Wand2 } from 'lucide-react';

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
    <>
      {isMobile && !open && (
        <div className="fixed top-4 right-4 z-[65]">
          <Button
            onClick={() => setOpen(true)}
            size="lg"
            className="bg-black text-white hover:bg-gray-900 rounded-full px-6 py-2 flex items-center gap-2 shadow-lg"
          >
            <Wand2 className="w-5 h-5" />
            <span>Generar</span>
          </Button>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[70]">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setOpen(false)}
          />
          
          {/* Modal */}
          <div className="absolute inset-y-0 right-0 left-16 md:left-64 min-h-screen bg-white animate-slide-up">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Generar Imagen</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Form Content */}
              <div className="space-y-4">
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 
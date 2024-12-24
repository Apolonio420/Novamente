"use client";

import { useUser } from "@clerk/nextjs";
import { Onboarding } from "@/components/Onboarding";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Sparkles, CreditCard, Stars, Camera } from "lucide-react";

const dreamMachines = [
  {
    id: "basic-generator",
    name: "Generador Básico",
    description: "Generá imagenes con Flux. Determiná el tamaño e ingresá tu prompt. Perfecto para empezar.",
    icon: <Sparkles className="w-8 h-8" />,
    path: "/generator/basic",
    features: ["Prompt simple", "Ajuste de tamaño"]
  },
  {
    id: "franatics",
    name: "Franatics",
    description: "¿Sos un verdadero fan de Franui? Generá tu credencial de Franatic",
    icon: <CreditCard className="w-8 h-8" />,
    path: "/generator/franatics",
    features: ["Cargá tu selfie", "Completá tus datos", "Elegí tu Franui favorito"]
  },
  {
    id: "lujan-tech",
    name: "Luján Tech",
    description: "Generá tu imagen personalizada para el Luján Tech",
    icon: <Camera className="w-8 h-8" />,
    path: "/generator/lujan-tech",
    features: ["Tomá una selfie", "Recibí tu imagen por email"]
  }
];

export default function Home() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1E1B2E" }}>
      {/* Header */}
      <header className="py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-white">
            ¡Bienvenido, {user?.firstName || 'Creador'}!
          </h1>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-8">
              Elige una de las siguientes opciones para comenzar:
            </p>

            {/* New Buttons Section */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Link href="/generator/basic">
                <Card className="p-12 hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-5 bg-primary text-white rounded-xl group-hover:scale-110 transition-transform">
                      <Sparkles className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-semibold group-hover:text-gray-300 transition-colors">
                      Ya sé que imagen quiero para mi prenda
                    </h3>
                  </div>
                  <p className="text-gray-400 mb-6 text-lg">
                    Si ya tienes una idea clara, genera tu imagen ahora.
                  </p>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                </Card>
              </Link>

              <Link href="/styles">
                <Card className="p-12 hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-5 bg-black text-white rounded-xl group-hover:scale-110 transition-transform">
                      <Sparkles className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-semibold group-hover:text-gray-600 transition-colors">
                      No sabes qué querés en tu prenda
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6 text-lg">
                    Explora nuestros estilos y encuentra inspiración.
                  </p>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                </Card>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

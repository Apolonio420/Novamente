"use client";

import { App } from "@/components/App";
import { UserRuns } from "@/components/UserRuns";
import { getUserRuns } from "@/server/getUserRuns";
import { useEffect, useState } from "react";
import type { Run } from "@/db/schema";

export default function BasicPage() {
  const [runs, setRuns] = useState<Run[]>([]);

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const userRuns = await getUserRuns();
        setRuns(userRuns);
      } catch (error) {
        console.error("Error fetching runs:", error);
      }
    };

    fetchRuns();
    
    // Actualizar cada 5 segundos
    const interval = setInterval(fetchRuns, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full p-4 flex flex-col items-center justify-center gap-4">
      <div className="max-w-[800px] w-full">
        <UserRuns runs={runs} />
      </div>
      <App />
    </div>
  );
} 
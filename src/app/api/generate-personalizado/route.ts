import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateImage } from "@/server/generate";
import { db } from "@/db/db";
import { runs } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { nombre, imagen, email } = body;

    // Validar los datos
    if (!nombre || !imagen || !email) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const result = await generateImage(imagen, process.env.VERCEL_URL || "http://localhost:3000", {
      height: 512,
      width: 512,
      lora: "",
      batchSize: 1
    });

    // Guardar en la base de datos
    await db.insert(runs).values({
      run_id: result,
      user_id: userId,
      deployment_id: "e322689e-065a-4d33-aa6a-ee941803ca95",
      live_status: "queued",
      inputs: {
        prompt: imagen,
        height: "512",
        width: "512",
        lora: "",
        lora_strength: "0.5"
      }
    });

    return NextResponse.json({ runId: result });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al generar la imagen" },
      { status: 500 }
    );
  }
} 
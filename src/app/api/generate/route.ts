import { generateImage } from "@/server/generate";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deploymentId } = body;

    if (!deploymentId) {
      return NextResponse.json(
        { error: "Falta el deploymentId" },
        { status: 400 }
      );
    }

    const endpoint = request.nextUrl.origin;

    const { prompt, height, width, lora } = body;
    if (!prompt || !height || !width) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: prompt, height, width" },
        { status: 400 }
      );
    }
    
    const run_id = await generateImage(prompt, endpoint, {
      height: parseInt(height, 10),
      width: parseInt(width, 10),
      lora: lora || "",
      batchSize: 1,
    });

    return NextResponse.json({ run_id }, { status: 200 });
  } catch (error: any) {
    console.error("Error en /api/generate:", error);
    return NextResponse.json(
      { error: error.message || "Error generating image" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // Obtener el usuario actual (opcional si la ruta es pública)
    const { userId } = auth();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    // Crear un nuevo FormData para enviar a ComfyDeploy
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    // Subir a ComfyDeploy
    const response = await fetch("https://api.comfydeploy.com/api/file/upload", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COMFY_DEPLOY_API_KEY}`
      },
      body: uploadFormData
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("ComfyDeploy error:", error);
      throw new Error(error.message || "Error uploading file to ComfyDeploy");
    }

    const data = await response.json();
    console.log("ComfyDeploy upload response:", data);

    return NextResponse.json({
      file_url: data.file_url,
      message: "File uploaded successfully"
    });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { 
        error: "Error uploading file",
        details: error.message
      },
      { status: 500 }
    );
  }
} 
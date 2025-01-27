import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
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
        // No incluir Content-Type, fetch lo establece automáticamente con el boundary correcto
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
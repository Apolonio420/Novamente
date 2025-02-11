import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { runs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const runId = data.run_id;

    if (!runId) {
      return NextResponse.json(
        { error: "No run_id provided" },
        { status: 400 }
      );
    }

    // Actualizar el estado en la base de datos
    await db
      .update(runs)
      .set({
        live_status: data.status,
        progress: data.progress || 0,
        ...(data.outputs?.[0]?.data?.images?.[0] && {
          image_url: typeof data.outputs[0].data.images[0] === 'string'
            ? data.outputs[0].data.images[0]
            : null
        })
      })
      .where(eq(runs.run_id, runId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

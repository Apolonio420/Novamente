import { db } from "@/db/db";
import { runs } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const userRuns = await db
      .select()
      .from(runs)
      .where(eq(runs.user_id, userId))
      .orderBy(desc(runs.created_at));

    return NextResponse.json(userRuns);
  } catch (error) {
    console.error("Error fetching user runs:", error);
    return NextResponse.json(
      { error: "Error al obtener las imágenes" },
      { status: 500 }
    );
  }
} 
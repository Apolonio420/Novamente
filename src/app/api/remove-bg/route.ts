import { NextResponse } from 'next/server';
import { removeBackground } from '@/server/imageService';

export async function POST(request: Request) {
  const { imageUrl } = await request.json();
  
  try {
    const processedUrl = await removeBackground(imageUrl);
    return NextResponse.json({ processedUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error removing background' },
      { status: 500 }
    );
  }
} 
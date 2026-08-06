import { NextResponse } from 'next/server';

export async function GET() {
  const key = process.env.GEMINI_API_KEY || '';
  return NextResponse.json({
    hasKey: !!process.env.GEMINI_API_KEY,
    length: key.length,
  });
}

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Invalid API endpoint' }, { status: 404 });
}

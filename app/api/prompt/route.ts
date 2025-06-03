import { NextResponse } from "next/server";
import { handlePrompt } from '@/app/lib/actions'

export async function POST(request: Request) {
  const { url } = await request.json()

  try {
    const analyzedPrompt = await handlePrompt(url)
    return NextResponse.json({ analyzedPrompt })
  } catch(e) {
    return NextResponse.json({ error: e instanceof Error ? e.message: 'Error'}, { status: 500 })
  }
}
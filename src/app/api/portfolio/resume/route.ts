import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://admin.naheel.me"

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${API_URL}/api/portfolio/resume`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return NextResponse.json({ pdfUrl: null, summary: "", skillGroups: [], experience: [], projects: [], education: [] })
    }

    const data = await res.json()
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch {
    return NextResponse.json({ pdfUrl: null, summary: "", skillGroups: [], experience: [], projects: [], education: [] }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"

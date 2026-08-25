import { NextResponse } from "next/server"
import { getProjects } from "@/lib/data"

export const revalidate = 3600

export async function GET() {
  try {
    const projects = await getProjects()

    const projectPages = projects
      .filter(p => p.showDetailPage !== false)
      .map(p => ({
        path: `/projects/${p.slug}`,
        label: p.title,
        type: "project" as const,
      }))

    return NextResponse.json(projectPages, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export const dynamic = "force-dynamic"

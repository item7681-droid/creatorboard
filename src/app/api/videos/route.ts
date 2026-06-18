import { NextResponse } from "next/server";
import { z } from "zod";
import { getVideoCandidates } from "@/lib/youtube/service";

const schema = z.object({
  keywords: z.array(z.string()).min(1),
  categoryId: z.string().optional(),
  youtubeApiKey: z.string().optional(),
  cacheOnly: z.boolean().optional()
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const videos = await getVideoCandidates(body.keywords, 100, body.categoryId, body.youtubeApiKey, {
      cacheOnly: body.cacheOnly ?? false
    });
    return NextResponse.json({ videos });
  } catch (error) {
    console.error("videos API error:", error);
    return NextResponse.json({ videos: [], error: String(error) }, { status: 500 });
  }
}

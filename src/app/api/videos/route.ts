import { NextResponse } from "next/server";
import { z } from "zod";
import { getVideoCandidates } from "@/lib/youtube/service";

const schema = z.object({
  keywords: z.array(z.string()).min(1),
  categoryId: z.string().optional(),
  youtubeApiKey: z.string().optional()
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  const videos = await getVideoCandidates(body.keywords, 15, body.categoryId, body.youtubeApiKey);
  return NextResponse.json({ videos });
}

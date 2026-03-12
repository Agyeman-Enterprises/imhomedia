import { NextRequest, NextResponse } from "next/server";
import { getEpisode } from "@/data/podcasts";

type Depth = "tldr" | "brief" | "deep";

const DEPTH_PROMPTS: Record<Depth, string> = {
  tldr: `Produce exactly 3 bullet points summarising the most important takeaways from this podcast episode. Each bullet should be a single punchy sentence. No intro, no outro — just 3 bullets starting with "•".`,
  brief: `Write a 2-minute read summary of this podcast episode (approximately 250-300 words). Write in flowing paragraphs, not bullets. Capture the main argument, the key evidence, and the conclusion. Use the episode's direct, opinionated voice.`,
  deep: `Produce structured deep notes for this podcast episode. Use the following format:
## Key Argument
One sentence.

## Main Points
• [Point 1 with timestamp if available]
• [Point 2 with timestamp if available]
• [Point 3 with timestamp if available]
• [Point 4 with timestamp if available]

## Notable Quotes
Pick 2-3 verbatim or near-verbatim quotes from the transcript with timestamps.

## Counterarguments Addressed
What pushback does the episode engage with?

## Takeaway
One sentence — what should the listener do or think differently?`,
};

// Simple in-memory cache for the server process lifetime
const summaryCache = new Map<string, string>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const showSlug = searchParams.get("showSlug");
  const episodeId = searchParams.get("episodeId");
  const depth = (searchParams.get("depth") ?? "tldr") as Depth;

  if (!showSlug || !episodeId) {
    return NextResponse.json(
      { error: "showSlug and episodeId are required" },
      { status: 400 }
    );
  }

  if (!["tldr", "brief", "deep"].includes(depth)) {
    return NextResponse.json(
      { error: "depth must be one of: tldr, brief, deep" },
      { status: 400 }
    );
  }

  const episode = getEpisode(showSlug, episodeId);
  if (!episode) {
    return NextResponse.json({ error: "Episode not found" }, { status: 404 });
  }

  const cacheKey = `${showSlug}:${episodeId}:${depth}`;
  const cached = summaryCache.get(cacheKey);
  if (cached) {
    return NextResponse.json({ summary: cached, cached: true });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI service not configured" },
      { status: 503 }
    );
  }

  const transcript = episode.transcript
    .map((seg) => `[${seg.time}] ${seg.text}`)
    .join("\n\n");

  const prompt = `Episode title: "${episode.title}"\n\nTranscript:\n\n${transcript}\n\n${DEPTH_PROMPTS[depth]}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: depth === "deep" ? 1024 : 512,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Anthropic API error:", err);
    return NextResponse.json(
      { error: "AI service error. Please try again." },
      { status: 502 }
    );
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text: string }>;
  };
  const summary = data.content.find((c) => c.type === "text")?.text ?? "";

  summaryCache.set(cacheKey, summary);

  return NextResponse.json({ summary, cached: false });
}

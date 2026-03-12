import { NextRequest, NextResponse } from "next/server";
import { getEpisode } from "@/data/podcasts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { showSlug, episodeId, question } = body as {
      showSlug?: string;
      episodeId?: string;
      question?: string;
    };

    if (!showSlug || !episodeId || !question) {
      return NextResponse.json(
        { error: "showSlug, episodeId, and question are required" },
        { status: 400 }
      );
    }

    const episode = getEpisode(showSlug, episodeId);
    if (!episode) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
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

    const systemPrompt = `You are a knowledgeable podcast assistant for IMHO Media. You have access to the full transcript of the episode "${episode.title}". Answer questions based ONLY on what is said in this transcript. Be specific and concise. When possible, reference the timestamp where the relevant content appears (e.g., "At 14:23, the host says..."). Do not speculate beyond the transcript content.`;

    const userMessage = `Episode transcript:\n\n${transcript}\n\nQuestion: ${question}\n\nAnswer based only on this transcript. Be specific and quote timestamps where possible.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
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
    const answer = data.content.find((c) => c.type === "text")?.text ?? "";

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Ask route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

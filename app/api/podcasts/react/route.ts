import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const REACTIONS_FILE = path.join(process.cwd(), "data", "reactions.json");

type Reaction = "fire" | "heart" | "mind_blown" | "insight" | "disagree";

interface ReactionRecord {
  id: string;
  show_slug: string;
  episode_id: string;
  timestamp_seconds: number;
  reaction: Reaction;
  session_id: string;
  created_at: string;
}

async function loadReactions(): Promise<ReactionRecord[]> {
  try {
    const raw = await fs.readFile(REACTIONS_FILE, "utf-8");
    return JSON.parse(raw) as ReactionRecord[];
  } catch {
    return [];
  }
}

async function saveReactions(records: ReactionRecord[]): Promise<void> {
  await fs.writeFile(REACTIONS_FILE, JSON.stringify(records, null, 2), "utf-8");
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const showSlug = searchParams.get("showSlug");
  const episodeId = searchParams.get("episodeId");

  if (!showSlug || !episodeId) {
    return NextResponse.json(
      { error: "showSlug and episodeId are required" },
      { status: 400 }
    );
  }

  const all = await loadReactions();
  const reactions = all.filter(
    (r) => r.show_slug === showSlug && r.episode_id === episodeId
  );

  // Aggregate by reaction type — find the peak timestamp
  const counts: Record<Reaction, number> = {
    fire: 0,
    heart: 0,
    mind_blown: 0,
    insight: 0,
    disagree: 0,
  };
  const peakSeconds: Record<Reaction, number> = {
    fire: 0,
    heart: 0,
    mind_blown: 0,
    insight: 0,
    disagree: 0,
  };

  // Bucket reactions into 30-second windows to find hotspots
  const buckets: Record<string, number> = {};
  for (const r of reactions) {
    counts[r.reaction]++;
    const bucket = Math.floor(r.timestamp_seconds / 30) * 30;
    const key = `${r.reaction}:${bucket}`;
    buckets[key] = (buckets[key] ?? 0) + 1;
  }

  // Find peak timestamp for each reaction
  for (const [key, count] of Object.entries(buckets)) {
    const [reaction, seconds] = key.split(":") as [Reaction, string];
    if (count > (buckets[`${reaction}:${peakSeconds[reaction]}`] ?? 0)) {
      peakSeconds[reaction] = parseInt(seconds);
    }
  }

  return NextResponse.json({ reactions, counts, peakSeconds });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { showSlug, episodeId, timestampSeconds, reaction, sessionId } = body as {
      showSlug?: string;
      episodeId?: string;
      timestampSeconds?: number;
      reaction?: string;
      sessionId?: string;
    };

    if (!showSlug || !episodeId || timestampSeconds === undefined || !reaction) {
      return NextResponse.json(
        { error: "showSlug, episodeId, timestampSeconds, and reaction are required" },
        { status: 400 }
      );
    }

    const validReactions: Reaction[] = ["fire", "heart", "mind_blown", "insight", "disagree"];
    if (!validReactions.includes(reaction as Reaction)) {
      return NextResponse.json(
        { error: `reaction must be one of: ${validReactions.join(", ")}` },
        { status: 400 }
      );
    }

    const record: ReactionRecord = {
      id: generateId(),
      show_slug: showSlug,
      episode_id: episodeId,
      timestamp_seconds: Math.round(timestampSeconds),
      reaction: reaction as Reaction,
      session_id: sessionId ?? "anonymous",
      created_at: new Date().toISOString(),
    };

    const all = await loadReactions();
    all.push(record);
    await saveReactions(all);

    return NextResponse.json({ success: true, id: record.id });
  } catch (err) {
    console.error("React route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

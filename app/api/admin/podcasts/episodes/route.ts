import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { SHOWS } from "@/data/podcasts";
import type { Episode } from "@/data/podcasts";

const EPISODES_FILE = path.join(process.cwd(), "data", "episodes-override.json");

interface EpisodeWithShow extends Episode {
  showSlug: string;
}

async function loadOverrides(): Promise<EpisodeWithShow[]> {
  try {
    const raw = await fs.readFile(EPISODES_FILE, "utf-8");
    return JSON.parse(raw) as EpisodeWithShow[];
  } catch {
    return [];
  }
}

async function saveOverrides(records: EpisodeWithShow[]): Promise<void> {
  await fs.writeFile(EPISODES_FILE, JSON.stringify(records, null, 2), "utf-8");
}

function generateId(): string {
  return "ep-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

// GET — list all episodes across all shows
export async function GET() {
  const overrides = await loadOverrides();
  const overrideIds = new Set(overrides.map((o) => `${o.showSlug}:${o.id}`));

  const base: EpisodeWithShow[] = SHOWS.flatMap((show) =>
    show.episodes.map((ep) => ({ ...ep, showSlug: show.slug }))
  ).filter((ep) => !overrideIds.has(`${ep.showSlug}:${ep.id}`));

  return NextResponse.json({ episodes: [...base, ...overrides] });
}

// POST — create new episode
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      showSlug,
      title,
      date,
      duration,
      durationSeconds,
      description,
      audioUrl,
      transcript,
    } = body as Partial<EpisodeWithShow>;

    if (!showSlug || !title || !date || !description) {
      return NextResponse.json(
        { error: "showSlug, title, date, and description are required" },
        { status: 400 }
      );
    }

    const showExists = SHOWS.some((s) => s.slug === showSlug);
    if (!showExists) {
      return NextResponse.json({ error: "Show not found" }, { status: 404 });
    }

    const episode: EpisodeWithShow = {
      id: generateId(),
      showSlug,
      title,
      date,
      duration: duration ?? "0 min",
      durationSeconds: durationSeconds ?? 0,
      description,
      listens: 0,
      transcript: transcript ?? [],
      keyMoments: [],
      knowledgeCards: [],
      audioUrl: audioUrl ?? undefined,
    };

    const overrides = await loadOverrides();
    overrides.push(episode);
    await saveOverrides(overrides);

    return NextResponse.json({ success: true, episode });
  } catch (err) {
    console.error("Admin episodes POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT — update episode
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, showSlug, ...updates } = body as Partial<EpisodeWithShow> & {
      id: string;
      showSlug: string;
    };

    if (!id || !showSlug) {
      return NextResponse.json({ error: "id and showSlug are required" }, { status: 400 });
    }

    const overrides = await loadOverrides();
    const idx = overrides.findIndex((o) => o.id === id && o.showSlug === showSlug);

    if (idx === -1) {
      // Check if it's a base episode — copy to overrides first
      const show = SHOWS.find((s) => s.slug === showSlug);
      const baseEp = show?.episodes.find((e) => e.id === id);
      if (!baseEp) {
        return NextResponse.json({ error: "Episode not found" }, { status: 404 });
      }
      const updated: EpisodeWithShow = { ...baseEp, ...updates, id, showSlug };
      overrides.push(updated);
      await saveOverrides(overrides);
      return NextResponse.json({ success: true, episode: updated });
    }

    const updated = { ...overrides[idx], ...updates, id, showSlug };
    overrides[idx] = updated;
    await saveOverrides(overrides);

    return NextResponse.json({ success: true, episode: updated });
  } catch (err) {
    console.error("Admin episodes PUT error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — delete episode
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const showSlug = searchParams.get("showSlug");

    if (!id || !showSlug) {
      return NextResponse.json({ error: "id and showSlug are required" }, { status: 400 });
    }

    const overrides = await loadOverrides();
    const filtered = overrides.filter(
      (o) => !(o.id === id && o.showSlug === showSlug)
    );
    await saveOverrides(filtered);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin episodes DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

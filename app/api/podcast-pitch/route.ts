import { NextResponse } from "next/server";
import { createAdminClient } from "@/auth-template/lib/supabase/admin";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

type PitchBody = {
  name?: string;
  showTitle?: string;
  concept?: string;
  sampleLink?: string;
  email?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PitchBody;
    const { name, showTitle, concept, sampleLink, email } = body;

    if (!name || !showTitle || !concept || !email) {
      return NextResponse.json(
        { error: "Name, show title, concept, and email are required." },
        { status: 400 }
      );
    }

    const pitch = {
      name,
      show_title: showTitle,
      concept,
      sample_link: sampleLink ?? null,
      email,
      status: "pending" as const,
    };

    const supabase = createAdminClient();

    if (supabase) {
      const { data, error } = await supabase
        .from("podcast_pitches")
        .insert(pitch)
        .select("id")
        .single();

      if (!error && data) {
        return NextResponse.json({
          success: true,
          message: "Pitch received! We\u2019ll be in touch within 5 business days.",
          id: (data as { id: string }).id,
        });
      }

      console.error("[podcast-pitch] Supabase insert error:", error);
      // Fall through to file fallback
    }

    // Fallback: append to data/podcast-pitches.json
    const fallbackId = crypto.randomUUID();
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "podcast-pitches.json");

    try {
      await mkdir(dataDir, { recursive: true });
      let existing: unknown[] = [];
      try {
        const raw = await readFile(filePath, "utf8");
        existing = JSON.parse(raw) as unknown[];
      } catch {
        // File doesn't exist yet — start fresh
      }
      existing.push({
        id: fallbackId,
        ...pitch,
        submitted_at: new Date().toISOString(),
      });
      await writeFile(filePath, JSON.stringify(existing, null, 2), "utf8");
    } catch (fileErr) {
      console.error("[podcast-pitch] File fallback error:", fileErr);
    }

    return NextResponse.json({
      success: true,
      message: "Pitch received! We\u2019ll be in touch within 5 business days.",
      id: fallbackId,
    });
  } catch (err) {
    console.error("[podcast-pitch] Unhandled error:", err);
    return NextResponse.json(
      { error: "Failed to process pitch submission." },
      { status: 500 }
    );
  }
}

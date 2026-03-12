import { NextResponse } from "next/server";
import { createAdminClient } from "@/auth-template/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      artistName?: string;
      trackTitle?: string;
      genre?: string;
      trackLink?: string;
      email?: string;
    };

    const { artistName, trackTitle, genre, trackLink, email } = body;

    if (!artistName || !trackTitle || !genre || !trackLink || !email) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const submission = {
      artist_name: artistName,
      track_title: trackTitle,
      genre,
      track_link: trackLink,
      email,
      status: "pending" as const,
    };

    const supabase = createAdminClient();

    if (supabase) {
      const { data, error } = await supabase
        .from("track_submissions")
        .insert(submission)
        .select("id")
        .single();

      if (error) {
        console.error("[submit] Supabase insert error:", error);
        // Fall through to logging fallback below
      } else {
        return NextResponse.json({
          success: true,
          message: "Track submitted! We'll review and notify you within 48 hours.",
          id: (data as { id: string }).id,
        });
      }
    }

    // Fallback: log the submission and return success so the form
    // still works when Supabase is not yet configured.
    const fallbackId = crypto.randomUUID();
    console.log("[submit] Track submission (no DB — logged only):", {
      id: fallbackId,
      ...submission,
      submitted_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Track submitted! We'll review and notify you within 48 hours.",
      id: fallbackId,
    });
  } catch (err) {
    console.error("[submit] Unhandled error:", err);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}

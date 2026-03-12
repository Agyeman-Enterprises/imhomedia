import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/auth-template/lib/supabase/server";
import { createAdminClient } from "@/auth-template/lib/supabase/admin";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface TrackSubmission {
  id: string;
  artist_name: string;
  track_title: string;
  genre: string;
  track_link: string;
  email: string;
  status: SubmissionStatus;
  submitted_at: string;
}

export async function GET() {
  // Verify the caller is authenticated
  const supabase = await createServerClient();

  if (!supabase) {
    // Supabase not configured — return empty list with a note
    return NextResponse.json({ submissions: [], note: "Supabase not configured" });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use admin client to bypass RLS for reading all submissions
  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Admin client unavailable" }, { status: 503 });
  }

  const { data, error } = await admin
    .from("track_submissions")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("[submissions GET] Supabase error:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }

  return NextResponse.json({ submissions: data as TrackSubmission[] });
}

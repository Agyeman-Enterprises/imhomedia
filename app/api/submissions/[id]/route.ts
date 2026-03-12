import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/auth-template/lib/supabase/server";
import { createAdminClient } from "@/auth-template/lib/supabase/admin";
import type { SubmissionStatus } from "../route";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verify the caller is authenticated
  const supabase = await createServerClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const body = await request.json() as { status?: string };
  const { status } = body;

  const validStatuses: SubmissionStatus[] = ["pending", "approved", "rejected"];
  if (!status || !validStatuses.includes(status as SubmissionStatus)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Admin client unavailable" }, { status: 503 });
  }

  const { data, error } = await admin
    .from("track_submissions")
    .update({ status: status as SubmissionStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[submissions PATCH] Supabase error:", error);
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 });
  }

  return NextResponse.json({ submission: data });
}

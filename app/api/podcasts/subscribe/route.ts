import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const SUBSCRIBERS_FILE = path.join(process.cwd(), "data", "subscribers.json");

interface Subscriber {
  id: string;
  email: string;
  show_slug: string | null;
  subscribed_at: string;
}

async function loadSubscribers(): Promise<Subscriber[]> {
  try {
    const raw = await fs.readFile(SUBSCRIBERS_FILE, "utf-8");
    return JSON.parse(raw) as Subscriber[];
  } catch {
    return [];
  }
}

async function saveSubscribers(records: Subscriber[]): Promise<void> {
  await fs.writeFile(
    SUBSCRIBERS_FILE,
    JSON.stringify(records, null, 2),
    "utf-8"
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, showSlug } = body as {
      email?: string;
      showSlug?: string;
    };

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const normalised = email.trim().toLowerCase();
    if (!isValidEmail(normalised)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const all = await loadSubscribers();
    const existing = all.find(
      (s) => s.email === normalised && (s.show_slug === (showSlug ?? null) || !showSlug)
    );

    if (existing) {
      return NextResponse.json(
        { success: true, message: "You\u2019re already subscribed — we\u2019ll let you know when new episodes drop." }
      );
    }

    const record: Subscriber = {
      id: generateId(),
      email: normalised,
      show_slug: showSlug ?? null,
      subscribed_at: new Date().toISOString(),
    };

    all.push(record);
    await saveSubscribers(all);

    return NextResponse.json({
      success: true,
      message: "You\u2019re subscribed. S\u2019Truth incoming.",
    });
  } catch (err) {
    console.error("Subscribe route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

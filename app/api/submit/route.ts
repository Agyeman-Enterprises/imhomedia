import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { artistName, trackTitle, genre, trackLink, email } = body;

    if (!artistName || !trackTitle || !genre || !trackLink || !email) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const submission = {
      id: crypto.randomUUID(),
      artistName,
      trackTitle,
      genre,
      trackLink,
      email,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    // Store submissions in a JSON file (swap for a DB later)
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "submissions.json");

    await fs.mkdir(dataDir, { recursive: true });

    let submissions = [];
    try {
      const existing = await fs.readFile(filePath, "utf-8");
      submissions = JSON.parse(existing);
    } catch {
      // File doesn't exist yet
    }

    submissions.push(submission);
    await fs.writeFile(filePath, JSON.stringify(submissions, null, 2));

    return NextResponse.json({
      success: true,
      message: "Track submitted! We'll review and notify you within 48 hours.",
      id: submission.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}

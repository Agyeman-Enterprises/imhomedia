import { NextRequest, NextResponse } from "next/server";
import { getShow } from "@/data/podcasts";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatRfc822(dateStr: string): string {
  return new Date(dateStr).toUTCString();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("show");

  if (!slug) {
    return new NextResponse("show parameter required", { status: 400 });
  }

  const show = getShow(slug);
  if (!show) {
    return new NextResponse("Show not found", { status: 404 });
  }

  const baseUrl = "https://imho.media";
  const showUrl = `${baseUrl}/podcasts/${show.slug}`;

  const itemsXml = show.episodes
    .map((ep) => {
      const epUrl = `${showUrl}/${ep.id}`;
      return `    <item>
      <title>${escapeXml(ep.title)}</title>
      <link>${escapeXml(epUrl)}</link>
      <guid isPermaLink="true">${escapeXml(epUrl)}</guid>
      <description>${escapeXml(ep.description)}</description>
      <pubDate>${formatRfc822(ep.date)}</pubDate>
      <itunes:duration>${ep.duration}</itunes:duration>
      <itunes:summary>${escapeXml(ep.description)}</itunes:summary>${ep.audioUrl ? `\n      <enclosure url="${escapeXml(ep.audioUrl)}" type="audio/mpeg" length="0"/>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(show.title)}</title>
    <link>${escapeXml(showUrl)}</link>
    <description>${escapeXml(show.description)}</description>
    <language>en-gb</language>
    <itunes:author>IMHO Media</itunes:author>
    <itunes:subtitle>${escapeXml(show.description)}</itunes:subtitle>
    <itunes:summary>${escapeXml(show.description)}</itunes:summary>
    <itunes:explicit>no</itunes:explicit>
    <itunes:category text="${escapeXml(show.tag)}"/>
    <itunes:owner>
      <itunes:name>IMHO Media</itunes:name>
      <itunes:email>podcasts@imho.media</itunes:email>
    </itunes:owner>
    <image>
      <url>${baseUrl}/imho-logo-hero.jpg</url>
      <title>${escapeXml(show.title)}</title>
      <link>${escapeXml(showUrl)}</link>
    </image>
    <itunes:image href="${baseUrl}/imho-logo-hero.jpg"/>
    <lastBuildDate>${show.episodes[0] ? formatRfc822(show.episodes[0].date) : new Date().toUTCString()}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

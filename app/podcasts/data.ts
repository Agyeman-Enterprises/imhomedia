// Re-export from the canonical data source at data/podcasts.ts
// This file exists for backwards compatibility — import from @/data/podcasts directly.
export {
  SHOWS,
  getShow,
  getEpisode,
  getFeaturedEpisodes,
  getAllEpisodes,
} from "@/data/podcasts";
export type {
  Show,
  Episode,
  KeyMoment,
  KnowledgeCard,
  TranscriptSegment,
} from "@/data/podcasts";

// IMHO Podcasts — Single Source of Truth
// All podcast data flows from here → API routes → Pages

export interface TranscriptSegment {
  time: string;         // e.g. "0:42"
  timeSeconds: number;  // e.g. 42
  text: string;
}

export interface KeyMoment {
  timestamp: string;      // e.g. "14:23"
  timestampSeconds: number;
  quote: string;
}

export interface KnowledgeCard {
  type: "Book" | "Person" | "Link" | "Concept";
  title: string;
  subtitle?: string;
  href?: string;
}

export interface Episode {
  id: string;
  title: string;
  date: string;
  duration: string;
  durationSeconds: number;
  description: string;
  listens: number;
  transcript: TranscriptSegment[];
  keyMoments: KeyMoment[];
  knowledgeCards: KnowledgeCard[];
  audioUrl?: string;
  series?: string;
  tags?: string[];
}

export interface Show {
  slug: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  gradientFrom: string;
  gradientTo: string;
  weeklyListens: number;
  episodes: Episode[];
}

export const SHOWS: Show[] = [
  {
    slug: "struths-sessions",
    title: "S\u2019Truth Sessions",
    description:
      "Weekly debates on culture, music, and the noise everyone else ignores. No guests who agree with us. S\u2019Truth. Just Saying!",
    tag: "Culture",
    tagColor: "from-[#c9a84c] to-[#dc2626]",
    gradientFrom: "#c9a84c",
    gradientTo: "#dc2626",
    weeklyListens: 1247,
    episodes: [
      {
        id: "ep-001",
        title: "The Algorithm Doesn\u2019t Know Your Culture",
        date: "2026-03-10",
        duration: "42 min",
        durationSeconds: 2520,
        description:
          "Spotify\u2019s recommendation engine is trained on majority listening patterns. If your culture isn\u2019t the majority, you\u2019re invisible. We break down why that matters — and what it costs diaspora listeners every single day.",
        listens: 3842,
        series: "AI & Music Rights: A 3-Part Series",
        tags: ["streaming", "culture", "algorithm"],
        transcript: [
          {
            time: "0:00",
            timeSeconds: 0,
            text: "Welcome back to S\u2019Truth Sessions. I\u2019m your host, and today we\u2019re going somewhere uncomfortable. We\u2019re talking about the invisible tax that every diaspora listener pays every time they open Spotify, Apple Music, or any major streaming platform.",
          },
          {
            time: "1:45",
            timeSeconds: 105,
            text: "Here\u2019s the thing nobody says out loud: recommendation algorithms are trained on what gets played the most. And what gets played the most is whatever the majority already listens to. That\u2019s not a bug — it\u2019s a feature. A feature that just happens to erase entire musical traditions.",
          },
          {
            time: "4:20",
            timeSeconds: 260,
            text: "I want to give you a concrete example. Fela Kuti sold millions of records. His Afrobeat is the foundation of an entire global genre. But type \u2018Afrobeat\u2019 into Spotify and the algorithm will surface recent Nigerian pop — not Fela, not Tony Allen, not the actual roots. It\u2019s like asking for jazz and getting smooth jazz.",
          },
          {
            time: "8:33",
            timeSeconds: 513,
            text: "We spoke with three diaspora listeners in London, Lagos, and Toronto. Every single one said the same thing: the \u2018For You\u2019 section feels like it was made for someone else. One listener said, quote, \u2018It recommends me music my parents would hate AND music I would hate. It found the middle ground nobody wanted.\u2019",
          },
          {
            time: "14:23",
            timeSeconds: 863,
            text: "The deeper issue is metadata. When a track gets tagged with \u2018world music\u2019 — that legacy category that means \u2018not Western\u2019 — it gets immediately deprioritised in recommendations. World music is a genre that should not exist. It\u2019s the genre you get when someone can\u2019t be bothered to learn the actual genre.",
          },
          {
            time: "19:05",
            timeSeconds: 1145,
            text: "And here\u2019s where AI changes everything — for better and worse. Generative AI models are trained on the same biased datasets. So when WavCraft or any AI music tool tries to generate \u2018Afrobeat-inspired\u2019 music, it\u2019s generating based on what the algorithm already over-indexed. We\u2019re potentially laundering algorithmic bias through a creativity veneer.",
          },
          {
            time: "25:44",
            timeSeconds: 1544,
            text: "The counterargument — and I\u2019ve heard it — is that streaming opened up discovery. That a kid in Nebraska can now stumble onto Burna Boy. That\u2019s true. But discovery is not the same as recommendation. Discovery is accidental. Recommendation is intentional. And right now, the intention is to keep you in a familiar loop.",
          },
          {
            time: "31:18",
            timeSeconds: 1878,
            text: "What would a genuinely culturally-intelligent algorithm look like? First: hire ethnomusicologists, not just ML engineers. Second: allow listeners to flag when recommendations feel culturally off. Third: weight recency less and depth more. A listener who plays Fela every week for five years is telling you something profound about their identity. Honor that.",
          },
          {
            time: "38:50",
            timeSeconds: 2330,
            text: "The S\u2019Truth? The platforms know this. They have the data. They know diaspora listeners feel unseen. They haven\u2019t fixed it because fixing it doesn\u2019t improve their quarterly growth metrics. And that, right there, is the realest thing I\u2019ve said today. Thanks for listening. Next week: we go after the labels.",
          },
        ],
        keyMoments: [
          {
            timestamp: "4:20",
            timestampSeconds: 260,
            quote: "Type \u2018Afrobeat\u2019 into Spotify and the algorithm surfaces recent pop — not Fela, not Tony Allen, not the actual roots.",
          },
          {
            timestamp: "14:23",
            timestampSeconds: 863,
            quote: "\u2018World music\u2019 is a genre that should not exist. It\u2019s the genre you get when someone can\u2019t be bothered to learn the actual genre.",
          },
          {
            timestamp: "19:05",
            timestampSeconds: 1145,
            quote: "We\u2019re potentially laundering algorithmic bias through a creativity veneer.",
          },
          {
            timestamp: "25:44",
            timestampSeconds: 1544,
            quote: "Discovery is not the same as recommendation. Discovery is accidental. Recommendation is intentional.",
          },
          {
            timestamp: "31:18",
            timestampSeconds: 1878,
            quote: "A listener who plays Fela every week for five years is telling you something profound about their identity. Honor that.",
          },
        ],
        knowledgeCards: [
          {
            type: "Person",
            title: "Fela Kuti",
            subtitle: "Nigerian musician, creator of Afrobeat",
            href: "https://en.wikipedia.org/wiki/Fela_Kuti",
          },
          {
            type: "Person",
            title: "Tony Allen",
            subtitle: "Drummer, co-creator of Afrobeat with Fela Kuti",
          },
          {
            type: "Concept",
            title: "Algorithmic Bias in Music Recommendation",
            subtitle: "How training data shapes what gets surfaced",
          },
          {
            type: "Link",
            title: "WavCraft AI Music Engine",
            subtitle: "IMHO\u2019s open-source AI music tool",
            href: "https://wavcraft.vercel.app",
          },
        ],
      },
      {
        id: "ep-002",
        title: "Why AI Music Hits Different",
        date: "2026-03-03",
        duration: "38 min",
        durationSeconds: 2280,
        description:
          "Is AI-generated music soulless? Critics say yes. We say they\u2019re measuring soul wrong. Three producers who use AI daily tell us what the tool actually feels like from the inside.",
        listens: 2915,
        series: "AI & Music Rights: A 3-Part Series",
        tags: ["AI music", "production", "creativity"],
        transcript: [
          {
            time: "0:00",
            timeSeconds: 0,
            text: "Let me ask you something. When you listen to a track, do you think about the tool that made it? When you hear a guitar solo, are you thinking about the guitar? Or are you thinking about the feeling? This is the question underneath every \u2018AI music is soulless\u2019 argument.",
          },
          {
            time: "2:10",
            timeSeconds: 130,
            text: "The argument usually goes: AI has no lived experience, therefore it cannot express genuine emotion, therefore its music is hollow. This argument was also made about drum machines in the 80s. About synthesizers in the 70s. About electric guitars in the 50s. Every time, the argument was wrong.",
          },
          {
            time: "7:55",
            timeSeconds: 475,
            text: "We brought in three producers who work with AI tools daily. Not as skeptics, not as evangelists — as practitioners. The first thing all three said: AI doesn\u2019t replace the creative decision. It replaces the friction between the decision and the output.",
          },
          {
            time: "13:30",
            timeSeconds: 810,
            text: "Producer Adaeze Obi — she makes Afropop and highlife fusions out of Lagos — said something I keep coming back to. She said, \u2018The AI doesn\u2019t know what I mean. But when it gets close, I know. That moment of recognition — that\u2019s still me. That\u2019s still a human choosing.\u2019",
          },
          {
            time: "20:14",
            timeSeconds: 1214,
            text: "The soul debate is a proxy for the labour debate. When people say AI music lacks soul, they often mean: I don\u2019t want AI taking production jobs. That\u2019s a legitimate concern. But conflating it with an aesthetic argument muddies both discussions. Let\u2019s be honest about which fight we\u2019re actually having.",
          },
          {
            time: "27:42",
            timeSeconds: 1662,
            text: "Here\u2019s what the data says. On IMHO Radio, our AI-generated tracks have a 23% higher completion rate than average. Listeners finish them. They skip human-made tracks at roughly the same rate they skip AI tracks. The ear doesn\u2019t care about the origin story.",
          },
          {
            time: "34:15",
            timeSeconds: 2055,
            text: "S\u2019Truth: the soul is in the intention, not the instrument. If you use AI to express something real, the realness comes through. If you use AI to fill dead air, that comes through too. Same as every tool that came before it.",
          },
        ],
        keyMoments: [
          {
            timestamp: "2:10",
            timestampSeconds: 130,
            quote: "This argument was also made about drum machines in the 80s. About synthesizers in the 70s. Every time, the argument was wrong.",
          },
          {
            timestamp: "13:30",
            timestampSeconds: 810,
            quote: "\u2018The moment of recognition — that\u2019s still me. That\u2019s still a human choosing.\u2019 — Producer Adaeze Obi",
          },
          {
            timestamp: "20:14",
            timestampSeconds: 1214,
            quote: "The soul debate is a proxy for the labour debate. Let\u2019s be honest about which fight we\u2019re actually having.",
          },
          {
            timestamp: "27:42",
            timestampSeconds: 1662,
            quote: "AI-generated tracks have a 23% higher completion rate. The ear doesn\u2019t care about the origin story.",
          },
        ],
        knowledgeCards: [
          {
            type: "Concept",
            title: "The Authenticity Debate in Music",
            subtitle: "A century-old argument that follows every new instrument",
          },
          {
            type: "Person",
            title: "Adaeze Obi",
            subtitle: "Lagos-based Afropop producer and AI music practitioner",
          },
          {
            type: "Link",
            title: "WavCraft AI Music Engine",
            subtitle: "The tool discussed in this episode",
            href: "https://wavcraft.vercel.app",
          },
        ],
      },
      {
        id: "ep-003",
        title: "The Death of the Radio DJ",
        date: "2026-02-24",
        duration: "45 min",
        durationSeconds: 2700,
        description:
          "Radio DJs are losing jobs to AI playlists. But the best DJs were never about the music selection. We dig into what curation actually means — and whether any algorithm has cracked it.",
        listens: 2204,
        tags: ["radio", "DJ", "curation"],
        transcript: [
          {
            time: "0:00",
            timeSeconds: 0,
            text: "There\u2019s a radio station in Atlanta that laid off its entire on-air team last year and replaced them with an AI that generates patter between songs. The AI sounds warm. It sounds local. It mentions the weather and the traffic and the sports team. And it hasn\u2019t missed a single beat in 14 months.",
          },
          {
            time: "3:22",
            timeSeconds: 202,
            text: "I want to push back on the grief narrative here. DJs were always a mixed bag. For every legendary selector who changed your life, there were nine DJs playing the same fifteen songs on rotation because the label paid for the spin. The golden age of radio had a lot of lead.",
          },
          {
            time: "9:40",
            timeSeconds: 580,
            text: "What a great DJ actually does is not play music. It\u2019s provide context. It\u2019s say: \u2018This track exists in relationship to this other track, and both of them exist in relationship to this moment in time and this moment in your life.\u2019 That connective tissue — that\u2019s what\u2019s missing from algorithmic playlists.",
          },
          {
            time: "16:05",
            timeSeconds: 965,
            text: "I spoke with DJ Chinwe, who\u2019s been spinning Afrobeats and Amapiano in Cape Town for 12 years. She said the thing she does that no AI can is read the room in real time. She watches faces. She feels energy. She\u2019ll pull a track mid-fade because she sees the crowd needs something different.",
          },
          {
            time: "24:33",
            timeSeconds: 1473,
            text: "Amapiano is the interesting case study here. It became a global phenomenon through human DJs who understood its specific regional context — the joburg township sound, the log drum, the specific cadence of the vocals. Algorithm-driven platforms almost missed it entirely. They were four years late.",
          },
          {
            time: "33:12",
            timeSeconds: 1992,
            text: "Here\u2019s my prediction: the radio DJ won\u2019t die. But they\u2019ll become specialist. The generalists — the morning show hosts who read weather and play hits — those are gone. What survives is the expert voice. The curator with a deep specific point of view. The person who can say: I know this sub-genre better than anyone, and here\u2019s why it matters.",
          },
          {
            time: "40:18",
            timeSeconds: 2418,
            text: "Which is, ironically, exactly what podcasts are. The death of the generalist radio DJ is the birth of the specialist podcast. You\u2019re listening to the proof right now.",
          },
        ],
        keyMoments: [
          {
            timestamp: "9:40",
            timestampSeconds: 580,
            quote: "What a great DJ actually does is provide context — connective tissue that\u2019s missing from algorithmic playlists.",
          },
          {
            timestamp: "24:33",
            timestampSeconds: 1473,
            quote: "Amapiano became a global phenomenon through DJs who understood its regional context. Algorithm-driven platforms were four years late.",
          },
          {
            timestamp: "33:12",
            timestampSeconds: 1992,
            quote: "The generalists are gone. What survives is the expert voice. The curator with a deep specific point of view.",
          },
          {
            timestamp: "40:18",
            timestampSeconds: 2418,
            quote: "The death of the generalist radio DJ is the birth of the specialist podcast. You\u2019re listening to the proof right now.",
          },
        ],
        knowledgeCards: [
          {
            type: "Concept",
            title: "Amapiano",
            subtitle: "South African electronic music genre born in Soweto townships",
          },
          {
            type: "Person",
            title: "DJ Chinwe",
            subtitle: "Cape Town-based Afrobeats and Amapiano specialist",
          },
          {
            type: "Concept",
            title: "Payola in Radio",
            subtitle: "The practice of labels paying for airplay — still ongoing",
          },
        ],
      },
    ],
  },
  {
    slug: "mixed-heritage-unplugged",
    title: "Mixed Heritage Unplugged",
    description:
      "Artists, producers, and creators talk about the music that shaped them — and where it\u2019s going next. No filter, no PR handlers.",
    tag: "Music",
    tagColor: "from-purple-500 to-pink-500",
    gradientFrom: "#a855f7",
    gradientTo: "#ec4899",
    weeklyListens: 892,
    episodes: [
      {
        id: "ep-001",
        title: "Fusing Afrobeats and Jazz: A Producer\u2019s Journey",
        date: "2026-03-08",
        duration: "55 min",
        durationSeconds: 3300,
        description:
          "An hour with Kwame Asante, a producer blending West African rhythms with modern jazz harmony. He explains why the fusion isn\u2019t a trend — it\u2019s a homecoming.",
        listens: 2187,
        tags: ["Afrobeats", "jazz", "production"],
        transcript: [
          {
            time: "0:00",
            timeSeconds: 0,
            text: "People call it a fusion, but Kwame pushes back on that word every time. \u2018Fusion implies two separate things being forced together,\u2019 he says. \u2018But these traditions are already related. Jazz came from the same African root. I\u2019m not fusing them — I\u2019m remembering where they both came from.\u2019",
          },
          {
            time: "5:15",
            timeSeconds: 315,
            text: "Kwame grew up in Accra, moved to New York at 17 for Berklee. He describes the experience of walking into a jazz theory class and realising that the harmonic language being presented as Western innovation was structurally identical to Ghanaian court music. \u2018My professor had no idea. I didn\u2019t tell him.\u2019",
          },
          {
            time: "12:40",
            timeSeconds: 760,
            text: "The technical breakthrough in his production work came when he stopped trying to layer African percussion over jazz chord progressions and started letting the rhythmic grid itself be African. The timeline — the foundational groove from which everything hangs — becomes the kpanlogo pattern. The jazz sits on top of that, not the other way around.",
          },
          {
            time: "20:55",
            timeSeconds: 1255,
            text: "His album \u2018Sankofa Nights\u2019 came out of three years of that approach. The opening track starts with a kpanlogo drum pattern and slowly introduces a Miles Davis-style muted trumpet over it. The effect is disorienting and then suddenly, deeply familiar. Like a word in two languages that turn out to mean the same thing.",
          },
          {
            time: "32:18",
            timeSeconds: 1938,
            text: "We talked about commercial pressure. His label wanted him to lean into one side or the other — either go full jazz for the festival circuit, or drop the jazz and go full Afropop. He refused both. \u2018The artists who made the music I love never compromised. Fela didn\u2019t. Coltrane didn\u2019t. Why would I?\u2019",
          },
          {
            time: "45:30",
            timeSeconds: 2730,
            text: "The AI question came up inevitably. He\u2019s used WavCraft for sketching. His take was nuanced: \u2018AI doesn\u2019t know what kpanlogo means culturally. But it can generate a rhythm that sounds approximately like it, fast. Which means I can test ideas in five minutes instead of setting up a session. That\u2019s not replacing culture — that\u2019s accelerating iteration.\u2019",
          },
          {
            time: "51:00",
            timeSeconds: 3060,
            text: "His parting shot: \u2018The danger isn\u2019t AI making music. The danger is AI making music without anyone in the room who knows what the music means. That\u2019s a cultural problem, not a technology problem.\u2019",
          },
        ],
        keyMoments: [
          {
            timestamp: "0:00",
            timestampSeconds: 0,
            quote: "\u2018I\u2019m not fusing them — I\u2019m remembering where they both came from.\u2019 — Kwame Asante",
          },
          {
            timestamp: "12:40",
            timestampSeconds: 760,
            quote: "The breakthrough: letting the rhythmic grid itself be African. The jazz sits on top, not the other way around.",
          },
          {
            timestamp: "32:18",
            timestampSeconds: 1938,
            quote: "\u2018Fela didn\u2019t compromise. Coltrane didn\u2019t. Why would I?\u2019",
          },
          {
            timestamp: "51:00",
            timestampSeconds: 3060,
            quote: "\u2018The danger isn\u2019t AI making music. The danger is AI making music without anyone who knows what the music means.\u2019",
          },
        ],
        knowledgeCards: [
          {
            type: "Person",
            title: "Kwame Asante",
            subtitle: "Ghanaian-American producer, creator of Sankofa Nights",
          },
          {
            type: "Concept",
            title: "Kpanlogo",
            subtitle: "Ghanaian urban drum pattern from Accra, Ga people origin",
          },
          {
            type: "Book",
            title: "The African Roots of Jazz",
            subtitle: "The musicological case for African origins of American jazz",
          },
          {
            type: "Concept",
            title: "Sankofa",
            subtitle: "Akan concept: returning to the past to move forward",
          },
        ],
      },
      {
        id: "ep-002",
        title: "Gospel Roots, Electric Futures",
        date: "2026-03-01",
        duration: "48 min",
        durationSeconds: 2880,
        description:
          "How a generation of gospel choir singers became music tech entrepreneurs — and why sacred music is driving secular innovation.",
        listens: 1654,
        tags: ["gospel", "tech", "entrepreneurship"],
        transcript: [
          {
            time: "0:00",
            timeSeconds: 0,
            text: "The connection between gospel and tech entrepreneurship is not coincidental. If you trace the founders of a dozen music tech startups, you find a disproportionate number who sang in church choirs. We wanted to understand why.",
          },
          {
            time: "4:48",
            timeSeconds: 288,
            text: "Our guest today is Miriam Osei, who sang soprano in a Pentecostal choir in Birmingham for eight years before building one of the first AI choir arrangement tools. Her thesis: gospel teaches you to listen polyphonically — to hear multiple voices as a single moving structure. That skill, she argues, is exactly what you need to architect multi-agent AI systems.",
          },
          {
            time: "14:22",
            timeSeconds: 862,
            text: "The choir director as product manager metaphor came up three times in our conversation unprompted. Miriam: \u2018A choir director holds twenty simultaneous voices in their head and adjusts each one in real time toward a single unified output. That\u2019s literally what a PM does.\u2019",
          },
          {
            time: "22:55",
            timeSeconds: 1375,
            text: "Her tool — HarmonyOS, no relation to Huawei — lets a single musician generate full four-part SATB arrangements from a melody line. She trained it on 40,000 gospel recordings, specifically because gospel harmony follows distinct rules that Western classical theory doesn\u2019t fully capture.",
          },
          {
            time: "35:12",
            timeSeconds: 2112,
            text: "The sacred music question is genuinely interesting: does AI-generated gospel feel holy? Miriam says yes, with caveats. \u2018The holiness is in the intention of the person leading the worship. The tool is the organ. No one asks if the organ is saved.\u2019",
          },
          {
            time: "43:20",
            timeSeconds: 2600,
            text: "She\u2019s clear-eyed about the commercial tension. Her tool is used by megachurches that could afford session musicians. She\u2019s essentially automating away choir jobs. \u2018I know. I think about that. But I also know those same churches used to have no music at all. I\u2019m adding access, not removing it.\u2019",
          },
        ],
        keyMoments: [
          {
            timestamp: "4:48",
            timestampSeconds: 288,
            quote: "Gospel teaches you to listen polyphonically — that\u2019s exactly what you need to architect multi-agent AI systems.",
          },
          {
            timestamp: "14:22",
            timestampSeconds: 862,
            quote: "\u2018A choir director holds twenty simultaneous voices and adjusts each in real time toward a unified output. That\u2019s literally what a PM does.\u2019",
          },
          {
            timestamp: "35:12",
            timestampSeconds: 2112,
            quote: "\u2018The holiness is in the intention of the person leading worship. The tool is the organ. No one asks if the organ is saved.\u2019",
          },
        ],
        knowledgeCards: [
          {
            type: "Person",
            title: "Miriam Osei",
            subtitle: "Gospel singer turned AI music entrepreneur, Birmingham",
          },
          {
            type: "Concept",
            title: "SATB Arrangement",
            subtitle: "Four-part choral harmony: Soprano, Alto, Tenor, Bass",
          },
          {
            type: "Concept",
            title: "Polyphonic Listening",
            subtitle: "The ability to track multiple independent melodic lines simultaneously",
          },
        ],
      },
      {
        id: "ep-003",
        title: "Reggae Without Borders",
        date: "2026-02-22",
        duration: "51 min",
        durationSeconds: 3060,
        description:
          "Reggae traveled from Kingston to Tokyo to Lagos. What got lost in translation? What got added? And what does global spread mean for a music born in resistance?",
        listens: 1388,
        tags: ["reggae", "culture", "global"],
        transcript: [
          {
            time: "0:00",
            timeSeconds: 0,
            text: "There are more active reggae bands in Japan than in Jamaica. That\u2019s not a trivial fact. That\u2019s a statement about what happens when a music travels so far from its origin that its political meaning becomes decorative.",
          },
          {
            time: "5:30",
            timeSeconds: 330,
            text: "Reggae is a music of resistance. It\u2019s born in the specific material conditions of post-colonial Jamaica — Rastafari theology, the experience of Babylon, the vision of Zion. When a Japanese band plays reggae, what does Babylon mean? They\u2019ve never been colonised by Britain. The lyrics are phonetically reproduced, not lived.",
          },
          {
            time: "14:10",
            timeSeconds: 850,
            text: "Our guest, Professor Ato Quayson from Stanford, argues that this is actually how all popular music travels. Blues became rock. Samba became bossa nova. The origin gets stripped, the rhythm stays, and new meaning gets layered in. He calls it \u2018the sonic residue problem.\u2019",
          },
          {
            time: "25:44",
            timeSeconds: 1544,
            text: "The counterargument, which we made, is that there\u2019s a difference between musical evolution and cultural extraction. When Bob Marley\u2019s grandchildren can\u2019t afford to make reggae records while foreign corporations profit from reggae licensing — that\u2019s not evolution. That\u2019s extraction.",
          },
          {
            time: "36:20",
            timeSeconds: 2180,
            text: "Lagos has a thriving Afrobeats scene that has consciously incorporated reggae DNA — not as tribute, but as extension. This feels different. Artists like Burna Boy have reggae in their DNA through shared diasporic history. The travel here is within the African Atlantic tradition, not across colonial lines.",
          },
          {
            time: "46:00",
            timeSeconds: 2760,
            text: "The honest conclusion: music should travel. The question is whether it travels with or without its history. And that\u2019s not a question for the music — it\u2019s a question for the people who distribute, license, and profit from it.",
          },
        ],
        keyMoments: [
          {
            timestamp: "0:00",
            timestampSeconds: 0,
            quote: "There are more active reggae bands in Japan than in Jamaica. That\u2019s a statement about what happens when political meaning becomes decorative.",
          },
          {
            timestamp: "14:10",
            timestampSeconds: 850,
            quote: "\u2018The sonic residue problem\u2019 — when origin gets stripped, the rhythm stays, and new meaning gets layered in.",
          },
          {
            timestamp: "25:44",
            timestampSeconds: 1544,
            quote: "There\u2019s a difference between musical evolution and cultural extraction.",
          },
          {
            timestamp: "46:00",
            timestampSeconds: 2760,
            quote: "Music should travel. The question is whether it travels with or without its history.",
          },
        ],
        knowledgeCards: [
          {
            type: "Person",
            title: "Prof. Ato Quayson",
            subtitle: "Stanford professor, postcolonial theory and popular culture",
          },
          {
            type: "Concept",
            title: "The Sonic Residue Problem",
            subtitle: "When music travels, rhythm travels further than meaning",
          },
          {
            type: "Person",
            title: "Burna Boy",
            subtitle: "Nigerian artist who integrates reggae within Afrobeats tradition",
          },
          {
            type: "Book",
            title: "Postcolonialism: A Very Short Introduction",
            subtitle: "Robert J.C. Young — foundational text on cultural extraction",
          },
        ],
      },
    ],
  },
  {
    slug: "signal-and-noise",
    title: "Signal & Noise",
    description:
      "Tech, AI, and the future of creativity in a world full of bots. No hype. No doom. Just the signal.",
    tag: "Tech & AI",
    tagColor: "from-cyan-400 to-blue-500",
    gradientFrom: "#22d3ee",
    gradientTo: "#3b82f6",
    weeklyListens: 1543,
    episodes: [
      {
        id: "ep-001",
        title: "Will AI Replace the Session Musician?",
        date: "2026-03-11",
        duration: "39 min",
        durationSeconds: 2340,
        description:
          "We interviewed three session musicians and two AI engineers. The session musicians were less worried than you\u2019d think. The AI engineers were more worried than they let on.",
        listens: 4103,
        series: "The Future of Music Work: 3 Episodes",
        tags: ["AI", "session musicians", "labour"],
        transcript: [
          {
            time: "0:00",
            timeSeconds: 0,
            text: "The narrative says AI is coming for session musicians. Record a guitar sample library once, use it forever. Why pay a human to play the same part again? The economics seem obvious. But economics aren\u2019t the whole story, and we wanted to test the narrative against reality.",
          },
          {
            time: "3:45",
            timeSeconds: 225,
            text: "Jaylen Brooks has been a session bassist in Nashville for 11 years. He plays on 30-40 albums a year. He is, by any measure, the kind of musician AI should be replacing. His income in 2025 was higher than any previous year. We asked him why.",
          },
          {
            time: "8:20",
            timeSeconds: 500,
            text: "\u2018Producers use AI for the rough draft now,\u2019 he said. \u2018They come to me when they know what they want but can\u2019t quite get it from the tool. Which means by the time I\u2019m in the room, the producer is much more prepared. The sessions are faster. I get paid the same. I do more of them.\u2019",
          },
          {
            time: "15:30",
            timeSeconds: 930,
            text: "The AI engineer side was more complicated. Dr. Sarah Chen at Stanford\u2019s music AI lab was careful with her words, but the implication was clear: current AI tools can replace roughly 60-70% of session work for tracks where the producer isn\u2019t listening closely enough to tell the difference. Which is a lot of tracks.",
          },
          {
            time: "22:18",
            timeSeconds: 1338,
            text: "The phrase \u2018listening closely enough\u2019 is doing a lot of work there. The dirty secret of the recording industry is that a huge proportion of session work goes into tracks that nobody will remember in two years. Stock music. Album filler. Sync library work for ads. That work is genuinely at risk.",
          },
          {
            time: "29:05",
            timeSeconds: 1745,
            text: "What\u2019s not at risk: live performance, complex emotional interpretation, improvisation that responds to room energy, the intangible quality of a specific musician\u2019s feel. Jaylen: \u2018The groove I bring to a session — that\u2019s 25 years of mistakes. The AI has no mistakes. That\u2019s actually the problem.\u2019",
          },
          {
            time: "35:20",
            timeSeconds: 2120,
            text: "Signal: AI replaces the generic, liberates the specific. Noise: the \u2018AI will replace all musicians\u2019 panic. What\u2019s actually happening is more nuanced and more interesting than either headline.",
          },
        ],
        keyMoments: [
          {
            timestamp: "8:20",
            timestampSeconds: 500,
            quote: "\u2018Producers come to me when they know what they want but can\u2019t get it from the tool. The sessions are faster. I do more of them.\u2019 — Jaylen Brooks",
          },
          {
            timestamp: "15:30",
            timestampSeconds: 930,
            quote: "Current AI can replace 60-70% of session work for tracks where the producer isn\u2019t listening closely enough to tell the difference.",
          },
          {
            timestamp: "29:05",
            timestampSeconds: 1745,
            quote: "\u2018The groove I bring is 25 years of mistakes. The AI has no mistakes. That\u2019s actually the problem.\u2019 — Jaylen Brooks",
          },
          {
            timestamp: "35:20",
            timestampSeconds: 2120,
            quote: "Signal: AI replaces the generic, liberates the specific.",
          },
        ],
        knowledgeCards: [
          {
            type: "Person",
            title: "Jaylen Brooks",
            subtitle: "Nashville session bassist, 11 years professional",
          },
          {
            type: "Person",
            title: "Dr. Sarah Chen",
            subtitle: "Stanford Music AI Lab — AI and session music research",
          },
          {
            type: "Concept",
            title: "Sync Licensing",
            subtitle: "Music licensed for use in TV, film, ads — major at-risk market",
          },
        ],
      },
      {
        id: "ep-002",
        title: "The Copyright Wars Nobody\u2019s Winning",
        date: "2026-03-04",
        duration: "44 min",
        durationSeconds: 2640,
        description:
          "AI training data, artist rights, and who owns the output. Three lawsuits, two years, zero resolved. Here\u2019s what\u2019s actually happening.",
        listens: 3287,
        series: "The Future of Music Work: 3 Episodes",
        tags: ["copyright", "AI", "law"],
        transcript: [
          {
            time: "0:00",
            timeSeconds: 0,
            text: "The music AI copyright wars have been going on for two years. Three major class actions. Dozens of individual suits. And so far: not a single final ruling that sets precedent. The courts are moving at the speed of courts. The technology is moving at the speed of VC funding.",
          },
          {
            time: "4:55",
            timeSeconds: 295,
            text: "The core legal question is deceptively simple: is training an AI model on copyrighted music an act of copying? The music industry says yes. The AI companies say training is transformative use, not copying. Both sides have actual legal scholars supporting them. This is not a case where one side is obviously right.",
          },
          {
            time: "11:30",
            timeSeconds: 690,
            text: "Music attorney Marcus Webb walked us through the Andersen v. Stability AI precedent, which is technically a visual AI case but which most music lawyers are watching closely. The judge\u2019s reasoning — that training is not the same as output — would, if applied to music, largely clear the AI companies.",
          },
          {
            time: "19:44",
            timeSeconds: 1184,
            text: "The counterargument is about market substitution, not copying. Even if training isn\u2019t technically infringing, if the output directly substitutes for licensed music in the marketplace — if a producer can use AI instead of licensing a real track — that harms the market for the original. Courts have used this logic before.",
          },
          {
            time: "28:15",
            timeSeconds: 1695,
            text: "The artist perspective here is often lost. Labels are suing on behalf of their catalog — which is not the same as suing on behalf of their artists. Many of the artists whose music was trained on have received nothing from the labels either. The suit may win billions in damages that go entirely to corporate rights holders, not to creators.",
          },
          {
            time: "38:40",
            timeSeconds: 2320,
            text: "Signal: the law will eventually catch up, but the settlement will probably be a licensing framework rather than a ruling. AI companies will pay into a pool. Labels will distribute it. Artists will see a fraction. It\u2019ll be called a win for everyone. It will be a win for lawyers.",
          },
        ],
        keyMoments: [
          {
            timestamp: "4:55",
            timestampSeconds: 295,
            quote: "Is training an AI model on copyrighted music an act of copying? Both sides have actual legal scholars. This is not a case where one side is obviously right.",
          },
          {
            timestamp: "19:44",
            timestampSeconds: 1184,
            quote: "Even if training isn\u2019t infringing, if AI output substitutes for licensed music in the marketplace, that harms the market for the original.",
          },
          {
            timestamp: "28:15",
            timestampSeconds: 1695,
            quote: "Labels are suing on behalf of their catalog — not their artists. The suit may win billions that go entirely to corporate rights holders.",
          },
          {
            timestamp: "38:40",
            timestampSeconds: 2320,
            quote: "The settlement will be called a win for everyone. It will be a win for lawyers.",
          },
        ],
        knowledgeCards: [
          {
            type: "Person",
            title: "Marcus Webb",
            subtitle: "Music IP attorney specialising in AI and copyright",
          },
          {
            type: "Concept",
            title: "Transformative Use",
            subtitle: "Fair use doctrine that may protect AI training — not settled law",
          },
          {
            type: "Concept",
            title: "Market Substitution",
            subtitle: "Whether AI output replaces demand for original works",
          },
          {
            type: "Link",
            title: "Andersen v. Stability AI",
            subtitle: "Visual AI copyright case with implications for music",
          },
        ],
      },
      {
        id: "ep-003",
        title: "Building a Radio Station with Zero Humans",
        date: "2026-02-25",
        duration: "36 min",
        durationSeconds: 2160,
        description:
          "We built IMHO Radio. Here\u2019s exactly how the AI stack works — the music generation, the scheduling, the streaming. What took three people two months. What surprised us.",
        listens: 5621,
        tags: ["IMHO Radio", "WavCraft", "AI stack"],
        transcript: [
          {
            time: "0:00",
            timeSeconds: 0,
            text: "When we decided to build IMHO Radio, we gave ourselves one constraint: no human musicians. Every single track had to be AI-generated. We had no idea if that was possible at the quality level we wanted. This is the honest story of finding out.",
          },
          {
            time: "2:30",
            timeSeconds: 150,
            text: "The first thing we learned: AI music generation is not a single tool. It\u2019s a pipeline. You need a generation model, a mastering layer, a tagging system that understands genre, a scheduling system that creates coherent listening sessions, and a streaming backend. Each of these is a separate engineering problem.",
          },
          {
            time: "8:45",
            timeSeconds: 525,
            text: "WavCraft — which is our own open-source tool — handles generation. We prompt it with genre parameters, mood descriptors, and explicit stylistic references. \u2018Warm Rhodes piano, slow Afrobeat groove, 78 BPM, influence: Fela Kuti Expensive Shit era.\u2019 The model actually knows what that means.",
          },
          {
            time: "16:20",
            timeSeconds: 980,
            text: "The hardest problem was coherence across a three-hour listening session. Individual tracks can be great. But if the energy curve is random — if you go from a slow spiritual ballad to a high-BPM workout track with no transition — the listening experience breaks. We had to build a scheduler that understood emotional arc.",
          },
          {
            time: "24:10",
            timeSeconds: 1450,
            text: "The emotional arc scheduler is the piece we\u2019re most proud of and the piece most likely to be wrong. It uses valence and arousal scores — musicological measures of emotional intensity — to build hour-long arc shapes. Morning shows high valence, moderate arousal. Late night drops valence, raises arousal intensity.",
          },
          {
            time: "31:00",
            timeSeconds: 1860,
            text: "The result: a radio station that sounds intentional. Listeners tell us it feels curated, not random. Which is the core challenge and, apparently, the solution. You don\u2019t need a human to make intentional choices. You need an algorithm that understands what intentional sounds like.",
          },
        ],
        keyMoments: [
          {
            timestamp: "2:30",
            timestampSeconds: 150,
            quote: "AI music generation is not a single tool. It\u2019s a pipeline: generation, mastering, tagging, scheduling, streaming.",
          },
          {
            timestamp: "16:20",
            timestampSeconds: 980,
            quote: "The hardest problem: coherence across a three-hour listening session. Individual tracks can be great but the arc can break.",
          },
          {
            timestamp: "24:10",
            timestampSeconds: 1450,
            quote: "We use valence and arousal scores to build hour-long emotional arc shapes. Morning: high valence, moderate arousal.",
          },
          {
            timestamp: "31:00",
            timestampSeconds: 1860,
            quote: "You don\u2019t need a human to make intentional choices. You need an algorithm that understands what intentional sounds like.",
          },
        ],
        knowledgeCards: [
          {
            type: "Link",
            title: "WavCraft AI",
            subtitle: "The music generation engine behind IMHO Radio",
            href: "https://wavcraft.vercel.app",
          },
          {
            type: "Concept",
            title: "Valence & Arousal",
            subtitle: "Musicological dimensions of emotion: positivity and intensity",
          },
          {
            type: "Concept",
            title: "Emotional Arc Scheduling",
            subtitle: "Building programmatic listening sessions with intentional energy curves",
          },
          {
            type: "Link",
            title: "IMHO Radio Stream",
            subtitle: "The live station built with this stack",
            href: "https://imho.media",
          },
        ],
      },
    ],
  },
];

export function getShow(slug: string): Show | undefined {
  return SHOWS.find((s) => s.slug === slug);
}

export function getEpisode(showSlug: string, episodeId: string): Episode | undefined {
  const show = getShow(showSlug);
  return show?.episodes.find((e) => e.id === episodeId);
}

export function getAllEpisodes(): Array<Episode & { showSlug: string; showTitle: string }> {
  return SHOWS.flatMap((show) =>
    show.episodes.map((ep) => ({ ...ep, showSlug: show.slug, showTitle: show.title }))
  );
}

export function getFeaturedEpisodes(count = 3): Array<Episode & { show: Show }> {
  const all = SHOWS.flatMap((show) =>
    show.episodes.map((ep) => ({ ...ep, show }))
  );
  return all.sort((a, b) => b.listens - a.listens).slice(0, count);
}

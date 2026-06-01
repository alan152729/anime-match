import { Anime } from "../types";

export const MOCK_ANIMES: Anime[] = [
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    description: "A student joins a secret organization of sorcerers to eliminate a powerful Curse...",
    synopsis: "Yuji Itadori is a high school student with extraordinary physical abilities who lives in Sendai with his grandfather. After swallowing a cursed talisman—the finger of Ryomen Sukuna, the King of Curses—Yuji becomes cursed himself. He joins the Metropolitan Tokyo Jujutsu Technical High School to find and consume all of Sukuna's fingers, in order to eventually exorcise him and save humanity.",
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop", // anime artwork motif
    rating: 8.7,
    matchPercentage: 95,
    tags: ["SHONEN", "SUPERNATURAL"],
    type: "TV",
    episodes: 24,
    releaseYear: 2020,
    studio: "MAPPA",
    status: "Finished Airing",
    trailerUrl: "https://www.youtube.com/embed/g8zX3S6Z68g"
  },
  {
    id: "chainsaw-man",
    title: "Chainsaw Man",
    description: "Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to a debt...",
    synopsis: "Denji is a young man trapped in poverty, working off his deceased father's debt to the yakuza by harvesting devil corpses with his pet dog-demon Pochita, who has chainsaws for a face. After being betrayed and killed by the yakuza, Pochita merges with Denji to revive him as a human-devil hybrid with chainsaws on his arms and head, leading him to join the Public Safety Devil Hunters.",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop", // high quality stylized illustration
    rating: 8.5,
    matchPercentage: 92,
    tags: ["ACTION", "DARK FANTASY"],
    type: "TV",
    episodes: 12,
    releaseYear: 2022,
    studio: "MAPPA",
    status: "Finished Airing",
    trailerUrl: "https://www.youtube.com/embed/v4yY_g3E8rI"
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer",
    description: "Tanjiro Kamado sets out to become a demon slayer after his family was brutally slaughtered...",
    synopsis: "In Taisho-era Japan, kindhearted Tanjiro Kamado makes a living selling charcoal. His peaceful life is shattered when a demon slaughters his entire family, leaving only his younger sister Nezuko alive—but turned into a demon herself. Determined to find a cure for Nezuko and avenge his family, Tanjiro trains to join the Demon Slayer Corps, beginning an epic quest.",
    imageUrl: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=600&auto=format&fit=crop", // Samurai theme / Japanese artwork
    rating: 9.0,
    matchPercentage: 98,
    tags: ["ADVENTURE", "FANTASY"],
    type: "TV",
    episodes: 26,
    releaseYear: 2019,
    studio: "ufotable",
    status: "Finished Airing",
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    description: "In a world where hunters must battle deadly monsters, the weakest hunter acquires a system...",
    synopsis: "Ten years ago, 'the Gate' opened, connecting the real world with the monster realm. Ordinary human beings were granted superhuman powers to fight these beasts, known as 'Hunters'. Sung Jin-Woo is the weakest of the E-rank hunters. After barely surviving a double dungeon challenge, he waking up in a hospital to find a floating quest log that only he can see, initiating an unprecedented 'Level Up' journey.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop", // Dark portal fantasy theme
    rating: 8.9,
    matchPercentage: 94,
    tags: ["ACTION", "WEBTOON"],
    type: "TV",
    episodes: 12,
    releaseYear: 2024,
    studio: "A-1 Pictures",
    status: "Finished Airing",
    trailerUrl: "https://www.youtube.com/embed/9Bv_8IuYkH8"
  },
  {
    id: "cyberpunk-er",
    title: "Cyberpunk: ER",
    description: "A street kid trying to survive in Night City—a technology and body modification-obsessed city...",
    synopsis: "Cyberpunk: Edgerunners tells a standalone, 10-episode story about a street kid named David Martinez trying to survive in Night City, a technology and body modification-obsessed city of the future. Having everything to lose, David stays alive by choosing to become an edgerunner—a mercenary outlaw also known as a cyberpunk.",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop", // Cyberpunk city neon theme
    rating: 8.6,
    matchPercentage: 90,
    tags: ["SCI-FI", "CYBERPUNK"],
    type: "TV",
    episodes: 10,
    releaseYear: 2022,
    studio: "Trigger",
    status: "Finished Airing",
    trailerUrl: "https://www.youtube.com/embed/JtqIas3bYhg"
  },
  {
    id: "blue-lock",
    title: "Blue Lock",
    description: "Japan's quest for football glory leads them to create Blue Lock: a prison-like training academy...",
    synopsis: "After reflecting on the current state of Japanese Soccer, the Japanese Football Association decides to hire the enigmatic and eccentric coach Jinpachi Ego to achieve their dream of winning the World Cup. Believing Japan lacks an egoistic striker hungry for goals, Jinpachi initiates the Blue Lock—a prison-like facility where three hundred talented strikers from high schools across Japan are isolated and pitted against each other.",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop", // Soccer stadium theme
    rating: 8.3,
    matchPercentage: 88,
    tags: ["SPORTS", "THRILLER"],
    type: "TV",
    episodes: 24,
    releaseYear: 2022,
    studio: "Eight Bit",
    status: "Finished Airing",
    trailerUrl: "https://www.youtube.com/embed/yvD9v8e3r2w"
  },
  {
    id: "attack-on-titan",
    title: "Attack on Titan",
    description: "Humanity fights for survival against giant man-eating humanoids known as Titans.",
    synopsis: "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born of hunger but what seems to be out of pleasure. To ensure their survival, the remnants of humanity began living within defensive barriers, resulting in one hundred years without a single Titan encounter. However, that fragile calm is soon shattered when a colossal Titan manages to breach the supposedly impregnable outer wall.",
    imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop", // Distant wall neon theme
    rating: 9.1,
    matchPercentage: 97,
    tags: ["ACTION", "MILITARY", "DRAMA"],
    type: "TV",
    episodes: 75,
    releaseYear: 2013,
    studio: "WIT Studio / MAPPA",
    status: "Finished Airing",
    trailerUrl: "https://www.youtube.com/embed/MGRm4IzK1SQ"
  },
  {
    id: "death-note",
    title: "Death Note",
    description: "A high school student discovers a supernatural notebook that grants him the ability to kill.",
    synopsis: "Light Yagami is an ace student with great prospects—and he's bored out of his mind. But all that changes when he finds the Death Note, a notebook dropped by a rogue Shinigami death god Ryuk. Any human whose name is written in the notebook dies. Armed with this godlike power, Light decides to cleanse the world of all criminals under the alias Akira, while a brilliant eccentric detective named L sets out to catch him.",
    imageUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600&auto=format&fit=crop", // Dark red rose mysterious theme
    rating: 8.6,
    matchPercentage: 91,
    tags: ["MYSTERY", "PSYCHOLOGICAL", "THRILLER"],
    type: "TV",
    episodes: 37,
    releaseYear: 2006,
    studio: "Madhouse",
    status: "Finished Airing",
    trailerUrl: "https://www.youtube.com/embed/N3iF0_iMsc0"
  },
  {
    id: "frieren-beyond-journey",
    title: "Frieren: Beyond Journey's End",
    description: "An elf mage re-evaluates the bonds she formed with her party of heroes after their quest completes.",
    synopsis: "The adventure is over, but life goes on for an elven mage who is just beginning to learn what living is all about. Elf mage Frieren and her courageous fellow adventurers have defeated the Demon King and brought peace to the land. But Frieren will live much longer than the rest of her former party. How will she come to understand what life means to the humans around her?",
    imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=600&auto=format&fit=crop", // Magical forest theme
    rating: 9.3,
    matchPercentage: 99,
    tags: ["FANTASY", "DRAMA", "ADVENTURE"],
    type: "TV",
    episodes: 28,
    releaseYear: 2023,
    studio: "Madhouse",
    status: "Finished Airing",
    trailerUrl: "https://www.youtube.com/embed/qgQunxD0qK8"
  }
];

// Let's also provide actual direct links to official artwork images if the user prefers.
// These are extremely stable and highly polished URLs from the TMDB / MyAnimeList servers:
export const STABLE_ANIME_POSTERS = {
  "jujutsu-kaisen": "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
  "chainsaw-man": "https://cdn.myanimelist.net/images/anime/1160/124765.jpg",
  "demon-slayer": "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
  "solo-leveling": "https://cdn.myanimelist.net/images/anime/1749/140134.jpg",
  "cyberpunk-er": "https://cdn.myanimelist.net/images/anime/1814/126615.jpg",
  "blue-lock": "https://cdn.myanimelist.net/images/anime/1258/126920.jpg",
  "attack-on-titan": "https://cdn.myanimelist.net/images/anime/1948/143574.jpg",
  "death-note": "https://cdn.myanimelist.net/images/anime/9/9453.jpg",
  "frieren-beyond-journey": "https://cdn.myanimelist.net/images/anime/1015/138075.jpg"
};

// Bind those official stable cover art to the mock data by default for premium visual fidelity!
MOCK_ANIMES.forEach(anime => {
  if (STABLE_ANIME_POSTERS[anime.id as keyof typeof STABLE_ANIME_POSTERS]) {
    anime.imageUrl = STABLE_ANIME_POSTERS[anime.id as keyof typeof STABLE_ANIME_POSTERS];
  }
});

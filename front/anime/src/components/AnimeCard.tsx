import React from "react";
import { Star, ArrowUpRight, HelpCircle } from "lucide-react";
import { Anime } from "../types";

interface AnimeCardProps {
  key?: string | number;
  anime: Anime;
  onSelect: (anime: Anime) => void;
}

export default function AnimeCard({ anime, onSelect }: AnimeCardProps) {
  // Safe default values in case user supplies dynamic API data missing some fields
  const match = anime.matchPercentage || 90;
  const rating = anime.rating || 8.0;
  const tags = anime.tags || ["ANIME", "RECOMENDADO"];
  const title = anime.title || "Sem título";
  const desc = anime.description || "Nenhuma descrição fornecida para este anime.";
  const coverUrl = anime.imageUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop";

  // Match class colors dynamically for realistic feeling
  const getMatchTheme = (pct: number) => {
    if (pct >= 95) return "bg-rose-600 text-white";
    if (pct >= 90) return "bg-fuchsia-600 text-white";
    return "bg-purple-600 text-white";
  };

  return (
    <article 
      className="group flex flex-col bg-[#121216] rounded-xl overflow-hidden border border-zinc-800/40 hover:border-zinc-700/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/70 hover:-translate-y-1.5"
    >
      {/* Animated Image Wrapper Container */}
      <div className="relative aspect-[3/4] w-full bg-zinc-900 overflow-hidden">
        
        {/* Match Percentage Indicator Tag (Top-Left) */}
        <span className={`absolute top-3 left-3 z-10 px-2 py-1 rounded text-[10px] font-bold tracking-wider font-mono ${getMatchTheme(match)} uppercase shadow-md`}>
          {match}% Match
        </span>

        {/* Anime Image Poster */}
        <img
          src={coverUrl}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transform object-center group-hover:scale-105 duration-500 ease-out transition-transform"
          onError={(e) => {
            // Soft fallback if user connects broken URLs
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop";
          }}
        />

        {/* Overlay interactive play graphic on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
      </div>

      {/* Info Block */}
      <div className="p-4 flex-1 flex flex-col">
        
        {/* Small upper caps tags */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {tags.slice(0, 2).map((tag, idx) => (
            <span 
              key={idx} 
              className="text-[9px] font-bold tracking-wider text-purple-400 bg-purple-950/40 px-1.5 py-0.5 rounded font-mono uppercase border border-purple-900/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Anime Title */}
        <h3 className="text-sm font-semibold font-display text-zinc-100 group-hover:text-pink-400 tracking-tight line-clamp-1 transition-colors">
          {title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-1.5 flex-1 line-clamp-3">
          {desc}
        </p>

        {/* Divider line */}
        <hr className="border-zinc-800/60 my-3" />

        {/* Card Footer: Rating & Action Button */}
        <div className="flex items-center justify-between text-[11px] font-medium mt-auto">
          <div className="flex items-center gap-1 text-zinc-400 font-mono">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>★ {Number(rating).toFixed(1)} <span className="text-zinc-600 text-[10px]">Rating</span></span>
          </div>
          
          <button 
            onClick={() => onSelect(anime)}
            className="text-zinc-400 hover:text-white flex items-center gap-1 font-semibold group-hover/btn:translate-x-0.5 transition-colors cursor-pointer"
          >
            <span>More Info</span>
            <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </article>
  );
}

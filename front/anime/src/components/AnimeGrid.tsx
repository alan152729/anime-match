import React from "react";
import { ArrowLeftRight, HelpCircle } from "lucide-react";
import AnimeCard from "./AnimeCard";
import { Anime } from "../types";

interface AnimeGridProps {
  animes: Anime[];
  onSelectAnime: (anime: Anime) => void;
  title: string;
  onViewAllToggle?: () => void;
  isExpanded?: boolean;
}

export default function AnimeGrid({
  animes,
  onSelectAnime,
  title,
  onViewAllToggle,
  isExpanded = false
}: AnimeGridProps) {
  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Grid Meta Header */}
        <div className="flex items-end justify-between border-b border-zinc-800/40 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2">
              {title}
            </h2>
            <p className="text-xs text-zinc-500 font-sans">
              Algoritmo calibrado com base no seu padrão de consumo e interesses.
            </p>
          </div>

          {onViewAllToggle && (
            <button
              onClick={onViewAllToggle}
              className="text-xs font-semibold text-zinc-400 hover:text-pink-400 flex items-center gap-1 transition-colors cursor-pointer group"
            >
              <span>{isExpanded ? "Ver Menos" : "View All"}</span>
              <span className="transform group-hover:translate-x-0.5 transition-transform">&gt;</span>
            </button>
          )}
        </div>

        {/* Empty state fallback */}
        {animes.length === 0 ? (
          <div className="text-center py-20 px-4 bg-[#121216]/50 rounded-2xl border border-zinc-800/40 space-y-3">
            <p className="text-zinc-400 font-sans text-sm font-medium">Nenhum anime encontrado com essa descrição ou filtro.</p>
            <p className="text-zinc-600 text-xs">Experimente digitar outra palavra-chave (ex: "luta", "cyberpunk", "chainsaw").</p>
          </div>
        ) : (
          /* High-quality Responsive Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-8 animate-fadeIn">
            {animes.map((anime) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                onSelect={onSelectAnime}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

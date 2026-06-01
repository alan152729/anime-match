import React from "react";
import { X, Star, Calendar, Tv, ShieldAlert, Award, PlayCircle } from "lucide-react";
import { Anime } from "../types";

interface AnimeDetailsModalProps {
  anime: Anime | null;
  onClose: () => void;
}

export default function AnimeDetailsModal({ anime, onClose }: AnimeDetailsModalProps) {
  if (!anime) return null;

  const coverUrl = anime.imageUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Outer Click Dismiss */}
      <div className="absolute inset-0 cursor-default" onClick={onClose}></div>
      
      {/* Modal Card Content */}
      <div className="relative bg-[#111115] border border-zinc-850 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden animate-scaleUp z-10 my-8">
        
        {/* Absolute Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Side Graphic / Poster */}
          <div className="md:col-span-5 relative aspect-[3/4] md:aspect-auto md:h-full bg-zinc-900">
            <img
              src={coverUrl}
              alt={anime.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {/* Dark bottom gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#111115] via-transparent to-[#111115]/50"></div>
            
            {/* Match Percentage Overlay badge */}
            <div className="absolute bottom-4 left-4 p-3 bg-zinc-950/90 border border-zinc-900 rounded-lg backdrop-blur-sm">
              <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Grau de Combinação</span>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                {anime.matchPercentage || 90}% Match AI
              </span>
            </div>
          </div>

          {/* Right Side Info Area */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Header Title */}
              <div>
                <span className="text-[10px] font-bold text-pink-500 font-mono tracking-widest uppercase">
                  RECOMENDAÇÃO EM DESTAQUE
                </span>
                <h2 className="text-2xl font-bold font-display text-white tracking-tight mt-0.5">
                  {anime.title}
                </h2>
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-2">
                {anime.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold tracking-wider text-purple-400 bg-purple-950/40 border border-purple-900/30 px-2.5 py-1 rounded font-mono uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Info grid (Year, studio, episodes etc) */}
              <div className="grid grid-cols-3 gap-3 bg-zinc-900/50 rounded-lg border border-zinc-800/40 p-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-zinc-500 text-[10px] block font-mono">ESTÚDIO</span>
                  <span className="text-zinc-200 font-medium truncate block">{anime.studio || "Unknown"}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-zinc-500 text-[10px] block font-mono">FORMATO</span>
                  <span className="text-zinc-200 font-medium block flex items-center gap-1">
                    <Tv className="w-3.5 h-3.5 text-pink-500" />
                    {anime.type || "TV"}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-zinc-500 text-[10px] block font-mono">EPISÓDIOS</span>
                  <span className="text-zinc-200 font-medium block">
                    {anime.episodes || "Indefinido"}
                  </span>
                </div>
              </div>

              {/* Meta indicators */}
              <div className="flex items-center gap-4 text-xs font-medium text-zinc-300 font-mono">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Score: <strong className="text-zinc-100">{anime.rating || "8.5"}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  Lançamento: <strong>{anime.releaseYear || "2020"}</strong>
                </span>
              </div>

              {/* Synopsis text area */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-display">Sinopse Detalhada</h4>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans max-h-40 overflow-y-auto pr-1">
                  {anime.synopsis || anime.description}
                </p>
              </div>
            </div>

            {/* Seção Dinâmica do Player de Vídeo (CORS/MongoDB Sincronizado) */}
            <div className="space-y-2 pt-3 border-t border-zinc-850">
              <div className="flex items-center gap-1 text-xs text-zinc-400 font-semibold mb-2">
                <PlayCircle className="w-4 h-4 text-rose-500" />
                <span>Assista ao Trailer Oficial:</span>
              </div>
              
              {anime.trailerUrl ? (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-zinc-800 bg-black shadow-inner">
                  <iframe
                    src={anime.trailerUrl}
                    title={`${anime.title} Trailer`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="w-full aspect-video rounded-lg border border-zinc-850/60 bg-zinc-900/20 flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-zinc-500 text-xs font-mono">
                    Filme ou Trailer oficial indisponível para este título no banco de dados.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
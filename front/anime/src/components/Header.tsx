import React from "react";
import { Database, HelpCircle, Flame } from "lucide-react";

interface HeaderProps {
  onToggleApiPanel: () => void;
  isApiPanelOpen: boolean;
  useLiveApi: boolean;
}

export default function Header({ onToggleApiPanel, isApiPanelOpen, useLiveApi }: HeaderProps) {
  return (
    <header className="border-b border-zinc-800/60 bg-[#0c0c0f]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Icon */}
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600 shadow-lg shadow-pink-500/20 transform group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-1">
            Animes<span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">Match</span>
          </span>
        </div>

        {/* Global Controls & Developer Status */}
        <div className="flex items-center gap-3">
          
          {/* Status Badge Indicating Dynamic API or Mock State */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/95 border border-zinc-800 text-xs text-zinc-400">
            <span className={`w-2 h-2 rounded-full relative ${useLiveApi ? 'bg-emerald-500' : 'bg-amber-500'}`}>
              {useLiveApi && <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75"></span>}
            </span>
            <span>
              Modo: <strong className="text-zinc-200">{useLiveApi ? 'API em Produção' : 'Mock Ativo'}</strong>
            </span>
          </div>

          {/* Interactive Button to customize/test real JSON payload */}
          <button
            id="btn-toggle-api-panel"
            onClick={onToggleApiPanel}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all duration-300 ${
              isApiPanelOpen
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/10"
                : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300"
            }`}
            title="Configure sua API de produção ou insira dados em JSON diretamente"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Configurar API</span>
          </button>
        </div>
      </div>
    </header>
  );
}

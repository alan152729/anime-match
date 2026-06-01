import React, { useState, useEffect } from "react";
import { Search, Sparkles, Database, CheckCircle, Flame, Globe, Filter } from "lucide-react";
import { Anime, ApiConnectionConfig } from "./types";
import Header from "./components/Header";
import ApiConfigPanel from "./components/ApiConfigPanel";
import AnimeGrid from "./components/AnimeGrid";
import AnimeDetailsModal from "./components/AnimeDetailsModal";

// Lista de tags para o filtro de múltiplas categorias
const LISTA_CATEGORIAS = ["Action", "Drama", "Comedy", "Fantasy", "Sci-Fi", "Adventure", "Suspense"];

export default function App() {
  const [baseAnimes, setBaseAnimes] = useState<Anime[]>([]);
  const [renderedAnimes, setRenderedAnimes] = useState<Anime[]>([]);
  
  // Listas exclusivas da Home que buscam do banco inteiro
  const [listaAnimesHome, setListaAnimesHome] = useState<Anime[]>([]);
  const [listaFilmesHome, setListaFilmesHome] = useState<Anime[]>([]);

  // Índices de rotação contínua dentro dos quadradinhos
  const [indexAnimeAtual, setIndexAnimeAtual] = useState(0);
  const [indexFilmeAtual, setIndexFilmeAtual] = useState(0);

  // Controle dos botões seletores da página inicial ("animes" ou "filmes")
  const [categoriaHomeAtiva, setCategoriaHomeAtiva] = useState<"animes" | "filmes">("animes");
  
  // 🚀 ESTADO ATUALIZADO: Múltiplas categorias integradas à busca global da API
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);

  // Controle de Idioma (PT / EN)
  const [language, setLanguage] = useState<"PT" | "EN">("PT");

  // Controles de Busca e UI
  const [searchQuery, setSearchQuery] = useState("");
  const [isApiPanelOpen, setIsApiPanelOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const [isComputing, setIsComputing] = useState(false);
  const [searchFilterApplied, setSearchFilterApplied] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Controle de estados das Abas de Pesquisa
  const [activeTab, setActiveTab] = useState<"all" | "anime" | "movie" | "match">("all");

  const t = {
    PT: {
      subtitle: "Nosso motor de recomendação entende seu gosto. Diga o que curte e acharemos o match perfeito.",
      placeholder: "Ex: Eu gosto de Naruto, lutas épicas e superação...",
      button: "Buscar",
      activeSearch: "Exibindo resultados ordenados para",
      restore: "Restaurar Tudo",
      loading: "Buscando e minerando novos animes na rede...",
      titleGrid: "Recomendações Especiais para Você",
      titleSearch: "Resultados da Busca Inteligente",
      tabAll: "Ver Tudo",
      tabAnime: "Animes / Temporadas",
      tabMovie: "Filmes (Movies)",
      tabMatch: "⚡ Matches Parecidos"
    },
    EN: {
      subtitle: "Our recommendation engine understands your taste. Tell us what you like, and we'll find your perfect match.",
      placeholder: "e.g., I like Dragon Ball, epic fights, and power scaling...",
      button: "Match!",
      activeSearch: "Showing personalized results ordered for",
      restore: "Restore All",
      loading: "Searching and mining new anime from the network...",
      titleGrid: "Special Recommendations for You",
      titleSearch: "Smart Search Results",
      tabAll: "All Media",
      tabAnime: "Anime / Seasons",
      tabMovie: "Movies",
      tabMatch: "⚡ Smart Matches"
    }
  };

  // 🔄 CARREGA AS ROTAS DA HOME
  const carregarDadosHome = async () => {
    try {
      const [resAnimes, resFilmes] = await Promise.all([
        fetch("http://localhost:3000/api/home/animes-random"),
        fetch("http://localhost:3000/api/home/filmes-random")
      ]);

      if (resAnimes.ok) setListaAnimesHome(await resAnimes.json());
      if (resFilmes.ok) setListaFilmesHome(await resFilmes.json());
    } catch (err) {
      console.error("Erro ao carregar dados aleatórios da home:", err);
    }
  };

  useEffect(() => {
    carregarDadosHome();

    // Timers de rotação a cada 4 segundos
    const timerAnime = setInterval(() => {
      setIndexAnimeAtual((prev) => (listaAnimesHome.length > 0 ? (prev + 1) % listaAnimesHome.length : 0));
    }, 4000);

    const timerFilme = setInterval(() => {
      setIndexFilmeAtual((prev) => (listaFilmesHome.length > 0 ? (prev + 1) % listaFilmesHome.length : 0));
    }, 4000);

    const renovarLoteCompleto = setInterval(() => {
      if (!searchFilterApplied) carregarDadosHome();
    }, 180000);

    return () => {
      clearInterval(timerAnime);
      clearInterval(timerFilme);
      clearInterval(renovarLoteCompleto);
    };
  }, [listaAnimesHome.length, listaFilmesHome.length, searchFilterApplied]);

  const animeRotativo = listaAnimesHome[indexAnimeAtual];
  const filmeRotativo = listaFilmesHome[indexFilmeAtual];

  // 🔍 FUNÇÃO DE BUSCA UNIFICADA INTEGRADA DIRETAMENTE À API E AO BANCO DE DADOS
  const executarBuscaApi = async (termoTexto: string, tagsSelecionadas: string[]) => {
    // Se o usuário desmarcar tudo e apagar o texto, restaura o estado padrão da home
    if (!termoTexto.trim() && tagsSelecionadas.length === 0) {
      handleClearFilter();
      return;
    }

    setIsComputing(true);
    setApiError(null);
    setActiveTab("all");

    try {
      const queryParams = new URLSearchParams();
      if (termoTexto.trim()) queryParams.append("termo", termoTexto);
      if (tagsSelecionadas.length > 0) queryParams.append("categorias", tagsSelecionadas.join(","));

      const response = await fetch(`http://localhost:3000/api/recomendar?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Erro na busca do servidor.");
      }

      const dadosAnimes: Anime[] = await response.json();
      
      setRenderedAnimes(dadosAnimes);
      setSearchFilterApplied(true);
    } catch (err: any) {
      setApiError(err.message || "Não foi possível buscar recomendações.");
      alert(err.message);
    } finally {
      setIsComputing(false);
    }
  };

  // 🚀 PASSO A: Monitora reativamente mudanças nas tags de categoria selecionadas
  useEffect(() => {
    // Só dispara se existirem categorias selecionadas ou se um filtro de busca textual já estiver ativo
    if (categoriasSelecionadas.length > 0 || searchFilterApplied) {
      executarBuscaApi(searchQuery, categoriasSelecionadas);
    }
  }, [categoriasSelecionadas]);

  // Alternador de categorias/tags selecionadas
  const toggleCategoria = (categoria: string) => {
    if (categoriasSelecionadas.includes(categoria)) {
      setCategoriasSelecionadas(prev => prev.filter(c => c !== categoria));
    } else {
      setCategoriasSelecionadas(prev => [...prev, categoria]);
    }
    // Deixamos o useEffect acima cuidar do disparo da API de forma limpa!
  };

  // Disparador do formulário de envio de texto por input
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executarBuscaApi(searchQuery, categoriasSelecionadas);
  };

  const handleClearFilter = () => {
    setSearchQuery("");
    setSearchFilterApplied(false);
    setCategoriasSelecionadas([]);
    setActiveTab("all");
    carregarDadosHome();
  };

  // 🚀 LISTAGEM DE DADOS (Agora alimentada dinamicamente pela API quando há tags ativas)
  const dadosBaseParaFiltrar = searchFilterApplied ? renderedAnimes : (categoriaHomeAtiva === "animes" ? listaAnimesHome : listaFilmesHome);

  const animesFiltrados = dadosBaseParaFiltrar.filter(anime => {
    // Filtro reativo para gerenciar o comportamento de troca das abas na área de busca
    if (searchFilterApplied) {
      if (activeTab === "match") {
        if ((anime as any).isMatchRecommendation !== true || anime.type === "movie") return false;
      } else {
        if ((anime as any).isMatchRecommendation === true) return false;
        if (activeTab !== "all" && anime.type !== activeTab) return false;
      }
    }
    return true;
  });

  // Aumentado a visualização padrão para abranger os +6 novos itens carregados nas buscas de match/home
  const gridPrincipalAnimes = isExpanded || searchFilterApplied ? animesFiltrados : animesFiltrados.slice(0, 12);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0b0e] text-zinc-100 selection:bg-pink-500/30 selection:text-white antialiased radial-glow">
      
      {/* Botão de Idioma Flutuante */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-zinc-900 border border-zinc-850 px-3 py-1.5 rounded-full text-xs font-mono">
        <Globe className="w-3.5 h-3.5 text-pink-500" />
        <button onClick={() => setLanguage("PT")} className={`hover:text-white ${language === "PT" ? "text-pink-500 font-bold" : "text-zinc-400"}`}>PT</button>
        <span className="text-zinc-600">|</span>
        <button onClick={() => setLanguage("EN")} className={`hover:text-white ${language === "EN" ? "text-pink-500 font-bold" : "text-zinc-400"}`}>EN</button>
      </div>

      <Header
        onToggleApiPanel={() => setIsApiPanelOpen(!isApiPanelOpen)}
        isApiPanelOpen={isApiPanelOpen}
        useLiveApi={true}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pb-12">
        <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 text-center max-w-4xl mx-auto space-y-6">
          
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/90 border border-zinc-800 rounded-full text-[11px] text-zinc-400 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{language === "PT" ? "Plataforma de Recomendação Ativa" : "Intelligent Recommendation Platform"}</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Find Your Next <br />
              <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Favorite Anime
              </span>
            </h1>

            <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-xl mx-auto">
              {t[language].subtitle}
            </p>
          </div>

          {/* Form de Busca */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative group">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t[language].placeholder}
                className="w-full bg-[#131317]/95 border border-zinc-800 rounded-full py-3.5 pl-12 pr-32 text-xs md:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 shadow-2xl transition-all"
              />
              
              <button
                type="submit"
                className="absolute right-1.5 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-all shadow-lg active:scale-95"
              >
                <span>{t[language].button}</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* 🚀 PAINEL SELETOR DE MÚLTIPLAS CATEGORIAS (TAGS) CORRIGIDO */}
          <div className="max-w-2xl mx-auto mt-4 pt-2">
            <div className="flex items-center justify-center gap-1.5 text-zinc-400 text-xs mb-2.5 font-mono">
              <Filter className="w-3.5 h-3.5 text-purple-500" />
              <span>Filtrar por Categorias (Busca completa no Banco/API):</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {LISTA_CATEGORIAS.map(cat => {
                const ativa = categoriasSelecionadas.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategoria(cat)}
                    className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all border ${ativa ? "bg-purple-600/20 text-purple-400 border-purple-500/50 shadow-sm" : "bg-zinc-900/50 text-zinc-400 border-zinc-850 hover:text-zinc-200"}`}
                  >
                    {cat} {ativa && "✕"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loader */}
          {isComputing && (
            <div className="max-w-lg mx-auto bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-3 shadow-2xl">
              <div className="flex justify-between text-xs font-mono font-bold text-pink-400 animate-pulse">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
                  {t[language].loading}
                </span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden relative">
                <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 h-full w-1/2 rounded-full absolute animate-infinite-loading"></div>
              </div>
            </div>
          )}

          {/* Badge de Filtro Ativo */}
          {(searchFilterApplied || categoriasSelecionadas.length > 0) && !isComputing && (
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-purple-950/40 to-pink-950/40 border border-pink-500/20 rounded-lg text-xs">
              <span className="text-zinc-300">
                {searchFilterApplied && searchQuery.trim() ? `${t[language].activeSearch} "${searchQuery}"` : "Filtros de categoria aplicados no banco global"}
              </span>
              <button
                onClick={handleClearFilter}
                className="text-[10px] font-bold text-zinc-500 hover:text-zinc-200 uppercase tracking-wider underline"
              >
                {t[language].restore}
              </button>
            </div>
          )}
        </section>

        {/* BOTÕES SEPARADORES NA PÁGINA INICIAL */}
        {!searchFilterApplied && (
          <div className="flex justify-center gap-4 mb-10">
            <button
              onClick={() => { setCategoriaHomeAtiva("animes"); setCategoriasSelecionadas([]); }}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all border ${categoriaHomeAtiva === "animes" ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white border-transparent shadow-lg shadow-orange-500/20" : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white"}`}
            >
              Animes Aleatórios
            </button>
            <button
              onClick={() => { setCategoriaHomeAtiva("filmes"); setCategoriasSelecionadas([]); }}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all border ${categoriaHomeAtiva === "filmes" ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent shadow-lg shadow-pink-500/20" : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white"}`}
            >
              Filmes Aleatórios (Estúdios Ghibli & +)
            </button>
          </div>
        )}

        {/* QUADRADINHOS RECOMENDADORES ROTATIVOS */}
        {!searchFilterApplied && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            
            {/* ROTATIVO DE ANIMES */}
            {animeRotativo && (
              <div 
                onClick={() => setSelectedAnime(animeRotativo)}
                className="relative overflow-hidden rounded-2xl bg-[#131317]/40 border border-zinc-850 p-6 flex gap-5 cursor-pointer hover:border-orange-500/50 transition-all group active:scale-[0.99] shadow-xl"
              >
                <div className="absolute top-3 right-3 bg-orange-500/10 text-orange-400 text-[9px] font-mono px-2 py-0.5 rounded border border-orange-500/20 animate-pulse">
                  🔄 Rotacionando Anime
                </div>
                <img src={animeRotativo.imageUrl} alt={animeRotativo.title} className="w-24 h-36 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300 bg-zinc-800" />
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono block mb-1 uppercase tracking-wider">{animeRotativo.studio}</span>
                    <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-orange-400 transition-colors">{animeRotativo.title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-3 mt-2 leading-relaxed">{animeRotativo.synopsis}</p>
                  </div>
                  <div className="flex gap-1.5 flex-wrap mt-3">
                    {animeRotativo.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ROTATIVO DE FILMES */}
            {filmeRotativo && (
              <div 
                onClick={() => setSelectedAnime(filmeRotativo)}
                className="relative overflow-hidden rounded-2xl bg-[#131317]/40 border border-zinc-850 p-6 flex gap-5 cursor-pointer hover:border-pink-500/50 transition-all group active:scale-[0.99] shadow-xl"
              >
                <div className="absolute top-3 right-3 bg-pink-500/10 text-pink-400 text-[9px] font-mono px-2 py-0.5 rounded border border-pink-500/20 animate-pulse">
                  🎬 Rotacionando Filme
                </div>
                <img src={filmeRotativo.imageUrl} alt={filmeRotativo.title} className="w-24 h-36 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300 bg-zinc-800" />
                <div className="flex flex-col justify-between flex-1 py-1">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-mono block mb-1 uppercase tracking-wider">{filmeRotativo.studio}</span>
                    <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-pink-400 transition-colors">{filmeRotativo.title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-3 mt-2 leading-relaxed">{filmeRotativo.synopsis}</p>
                  </div>
                  <div className="flex gap-1.5 flex-wrap mt-3">
                    {filmeRotativo.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ABAS SEPARADORAS DE CATEGORIA DA PESQUISA */}
        {searchFilterApplied && !isComputing && (
          <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-7xl mx-auto">
            <button onClick={() => setActiveTab("all")} className={`px-5 py-2 rounded-full text-xs font-bold transition-all border ${activeTab === 'all' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent shadow-lg' : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white'}`}>{t[language].tabAll}</button>
            <button onClick={() => setActiveTab("anime")} className={`px-5 py-2 rounded-full text-xs font-bold transition-all border ${activeTab === 'anime' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent shadow-lg' : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white'}`}>{t[language].tabAnime}</button>
            <button onClick={() => setActiveTab("movie")} className={`px-5 py-2 rounded-full text-xs font-bold transition-all border ${activeTab === 'movie' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent shadow-lg' : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white'}`}>{t[language].tabMovie}</button>
            <button onClick={() => setActiveTab("match")} className={`px-5 py-2 rounded-full text-xs font-bold transition-all border ${activeTab === 'match' ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white border-transparent shadow-lg shadow-orange-500/20' : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white'}`}>{t[language].tabMatch}</button>
          </div>
        )}

        {/* Grid de Exibição Dinâmico */}
        <AnimeGrid
          animes={gridPrincipalAnimes}
          onSelectAnime={setSelectedAnime}
          title={searchFilterApplied ? t[language].titleSearch : (categoriaHomeAtiva === "animes" ? "Animes Disponíveis" : "Filmes do Banco de Dados")}
          onViewAllToggle={searchFilterApplied ? undefined : () => setIsExpanded(!isExpanded)}
          isExpanded={isExpanded}
        />
      </main>

      {selectedAnime && (
        <AnimeDetailsModal anime={selectedAnime} onClose={() => setSelectedAnime(null)} />
      )}

      <footer className="border-t border-zinc-900 bg-zinc-950 px-6 py-10 mt-auto text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <p>© 2026 AnimesMatch. Live Database Synergized.</p>
        </div>
      </footer>
    </div>
  );
}
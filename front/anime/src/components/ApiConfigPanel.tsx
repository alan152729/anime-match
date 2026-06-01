import React, { useState } from "react";
import { Database, Link2, Copy, Check, Info, FileCode, AlertTriangle, RefreshCw } from "lucide-react";
import { ApiConnectionConfig, Anime } from "../types";

interface ApiConfigPanelProps {
  config: ApiConnectionConfig;
  onChangeConfig: (newConfig: ApiConnectionConfig) => void;
  mockJsonString: string;
  onApplyRawJson: (jsonString: string) => void;
  onFetchFromUrl: (url: string) => Promise<void>;
  loading: boolean;
  errorMsg: string | null;
}

export default function ApiConfigPanel({
  config,
  onChangeConfig,
  mockJsonString,
  onApplyRawJson,
  onFetchFromUrl,
  loading,
  errorMsg
}: ApiConfigPanelProps) {
  const [copied, setCopied] = useState(false);
  const [jsonText, setJsonText] = useState(config.rawJsonInput || mockJsonString);
  const [urlInput, setUrlInput] = useState(config.endpointUrl);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(mockJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyJson = () => {
    onApplyRawJson(jsonText);
  };

  const handleUrlFetchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onFetchFromUrl(urlInput);
  };

  return (
    <section className="bg-zinc-950 border-b border-zinc-800/80 p-5 md:p-6 transition-all animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Group */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-5 border-b border-zinc-800/50">
          <div>
            <h2 className="text-base font-semibold font-display text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-pink-500" />
              Painel do Desenvolvedor — Conexão com sua API de Produção
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Configure as propriedades abaixo para mapear as fotos, nomes e descrições do seu próprio banco de dados em tempo real.
            </p>
          </div>
          
          {/* Mode Toggles */}
          <div className="flex items-center gap-2 p-1 bg-zinc-900 rounded-lg border border-zinc-800 self-start">
            <button
              onClick={() => onChangeConfig({ ...config, useLiveApi: false })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
                !config.useLiveApi
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Dados Locais/Mockados
            </button>
            <button
              onClick={() => onChangeConfig({ ...config, useLiveApi: true })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
                config.useLiveApi
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Integração de API Direta
            </button>
          </div>
        </div>

        {/* Content Tabs depending on Live API or Mock mode */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column — API / JSON Controls */}
          <div className="lg:col-span-7 space-y-4">
            
            {config.useLiveApi ? (
              <form onSubmit={handleUrlFetchSubmit} className="space-y-3 p-4 bg-zinc-900/60 rounded-xl border border-zinc-850">
                <label className="block text-xs font-medium text-zinc-300">
                  URL do seu endpoint de produção (API):
                </label>
                <p className="text-[11px] text-zinc-500">
                  O app enviará uma requisição <code className="text-pink-400">GET</code> para este endereço e atualizará a lista. Certifique-se de habilitar o CORS em seu servidor de produção.
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="url"
                      placeholder="https://api.seuservidor.com/v1/animes"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-medium text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {loading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    {loading ? 'Carregando...' : 'Fetchar API'}
                  </button>
                </div>
                
                {errorMsg && (
                  <div className="mt-3 p-2.5 rounded-lg bg-red-950/40 border border-red-900/40 text-red-400 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Erro ao conectar com sua API:</p>
                      <p className="text-[11px] opacity-90 mt-0.5">{errorMsg}</p>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        Dica: Se sua API está rodando localmente, certifique-se de permitir CORS e que o certificado HTTPS esteja correto. Enquanto isso, tente usar o editor de JSON manual abaixo!
                      </p>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-850 text-xs text-zinc-400 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-zinc-200 font-semibold text-xs">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  Modo de Demonstração (Dados Locais Mockados) ativo
                </div>
                <p className="text-[11px] leading-relaxed">
                  Os dados sendo exibidos na tela são originados de um array estático que você pode visualizar e editar diretamente. Altere as propriedades abaixo e clique em <strong>Aplicar Alterações</strong> para atualizar os posters, títulos e porcentagens em tempo real no app.
                </p>
              </div>
            )}

            {/* JSON Code Input Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-pink-400" />
                  Editor de Dados em Tempo Real (Formato JSON)
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Esquema de Array de Animes</span>
              </div>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full h-48 bg-zinc-950 border border-zinc-800 focus:border-pink-500 rounded-lg p-3 font-mono text-[11px] text-zinc-300 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all resize-y"
              />
              <div className="flex justify-between items-center gap-3">
                <button
                  onClick={() => {
                    setJsonText(mockJsonString);
                    onApplyRawJson(mockJsonString);
                  }}
                  className="px-3 py-1.5 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs font-medium cursor-pointer transition-colors"
                >
                  Restaurar Original
                </button>
                <button
                  onClick={handleApplyJson}
                  className="bg-zinc-800 hover:bg-zinc-700 text-pink-400 border border-pink-500/20 px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                >
                  Aplicar Alterações no Layout
                </button>
              </div>
            </div>

          </div>

          {/* Right Column — API Map Reference Guide */}
          <div className="lg:col-span-5 bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl space-y-3.5">
            <h3 className="text-xs font-bold font-display text-white tracking-wide uppercase">
              Guia de Integração do seu Layout
            </h3>
            
            <p className="text-[11px] leading-relaxed text-zinc-400">
              Para consumir seu próprio JSON sem quebrar os elementos visuais, defina sua API para retornar os objetos contendo as seguintes propriedades:
            </p>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              <div className="flex items-start gap-2.5 text-[11px] border-b border-zinc-800/40 pb-2">
                <code className="text-blue-400 font-semibold bg-blue-950/40 px-1 py-0.5 rounded text-[10px]">title</code>
                <span className="text-zinc-300">string — Nome do anime (ex: "Jujutsu Kaisen").</span>
              </div>
              <div className="flex items-start gap-2.5 text-[11px] border-b border-zinc-800/40 pb-2">
                <code className="text-pink-400 font-semibold bg-pink-950/40 px-1 py-0.5 rounded text-[10px]">imageUrl</code>
                <span className="text-zinc-300">string — Link direto para imagem do poster (HTTP/HTTPS).</span>
              </div>
              <div className="flex items-start gap-2.5 text-[11px] border-b border-zinc-800/40 pb-2">
                <code className="text-purple-400 font-semibold bg-purple-950/40 px-1 py-0.5 rounded text-[10px]">description</code>
                <span className="text-zinc-300">string — Descrição curta de até 1 parágrafo.</span>
              </div>
              <div className="flex items-start gap-2.5 text-[11px] border-b border-zinc-800/40 pb-2">
                <code className="text-emerald-400 font-semibold bg-emerald-950/40 px-1 py-0.5 rounded text-[10px]">rating</code>
                <span className="text-zinc-300">number — Nota de avaliação (0.0 até 10.0).</span>
              </div>
              <div className="flex items-start gap-2.5 text-[11px] border-b border-zinc-800/40 pb-2">
                <code className="text-amber-400 font-semibold bg-amber-950/40 px-1 py-0.5 rounded text-[10px]">matchPercentage</code>
                <span className="text-zinc-300">number — Porcentagem de relevância (0 até 100).</span>
              </div>
              <div className="flex items-start gap-2.5 text-[11px] pb-1">
                <code className="text-cyan-400 font-semibold bg-cyan-950/40 px-1 py-0.5 rounded text-[10px]">tags</code>
                <span className="text-zinc-300">array — Marcadores superiores no card (ex: ["SHONEN", "FANTASY"]).</span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800">
              <button
                onClick={handleCopySchema}
                className="w-full flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copiado para Área de Transferência!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Modelo de JSON de Exemplo
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

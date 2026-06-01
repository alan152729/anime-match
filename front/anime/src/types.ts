/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Interface principal representando um Anime.
// Este schema foi planejado para ser 100% compatível com respostas de APIs JSON reais.
export interface Anime {
  id: string | number;
  title: string;
  description: string; // Descrição curta para o card
  synopsis: string;    // Sinopse completa para o modal de informações
  imageUrl: string;    // Link direto da foto do anime (ex: poster oficial)
  rating: number;      // Nota (ex: 8.7)
  matchPercentage: number; // Porcentagem de relevância (ex: 95)
  tags: string[];      // Gêneros e marcadores (ex: ["SHONEN", "SUPERNATURAL"])
  type?: string;       // Formato (ex: "TV", "Movie", "OVA")
  episodes?: number | string; // Quantidade de episódios (ex: 24)
  releaseYear?: number | string; // Ano de lançamento (ex: 2020)
  studio?: string;     // Estúdio de animação (ex: "MAPPA")
  status?: string;     // Status atual (ex: "Finished Airing", "Currently Airing")
  trailerUrl?: string; // Link de trailer (ex: YouTube embed)
}

// Configurações do painel desenvolvedor para simular / conectar a API real.
export interface ApiConnectionConfig {
  endpointUrl: string;
  useLiveApi: boolean;
  rawJsonInput: string;
}

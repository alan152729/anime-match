require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// Função auxiliar para padronizar e formatar o objeto que o Front-end consome
function formatarResposta(anime) {
    const tipoMidia = (anime.type && anime.type.toLowerCase() === 'movie') ? 'movie' : 'anime';
    return {
        mal_id: anime.mal_id,
        title: anime.title,
        matchPercentage: anime.matchPercentage || Math.floor(Math.random() * (98 - 75 + 1)) + 75,
        tags: anime.genres ? anime.genres.map(g => g.name) : [],
        studio: anime.studios && anime.studios[0] ? anime.studios[0].name : "Desconhecido",
        type: tipoMidia,
        episodes: anime.episodes || "Indefinido",
        rating: anime.score ? anime.score.toString() : "8.0",
        releaseYear: anime.aired && anime.aired.prop?.from?.year ? anime.aired.prop.from.year.toString() : "2020",
        synopsis: anime.synopsis || "Sinopse não cadastrada.",
        imageUrl: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || "",
        trailerUrl: anime.trailer?.embed_url || null
    };
}

// 🚀 ROTA DE BUSCA INTELIGENTE ATUALIZADA (Sem limites de paginação)
app.get('/api/recomendar', async (req, res) => {
  const fraseDoUsuario = req.query.termo || '';
  const categoriasParam = req.query.categorias || ''; 
  
  const categoriasFiltro = categoriasParam ? categoriasParam.split(',') : [];

  if (!fraseDoUsuario.trim() && categoriasFiltro.length === 0) {
    return res.status(400).json({ error: "Por favor, forneça um termo de pesquisa ou selecione uma categoria." });
  }

  try {
    await client.connect();
    const database = client.db('site_animes');
    const colecaoAnimes = database.collection('animes');

    let animesEncontrados = [];
    let termoPesquisa = "";

    // -------------------------------------------------------------------------
    // CASO A: O usuário digitou um termo de pesquisa por texto (com ou sem tags)
    // -------------------------------------------------------------------------
    if (fraseDoUsuario.trim()) {
      termoPesquisa = fraseDoUsuario
          .toLowerCase()
          .replace("eu gosto de", "")
          .replace("quero animes parecidos com", "")
          .replace("qual anime é parecido com", "")
          .trim();

      animesEncontrados = await colecaoAnimes.find({
          title: { $regex: termoPesquisa, $options: 'i' },
          "genres.name": { $not: { $regex: "Hentai|Erotica", $options: "i" } }
      }).toArray();

      if (animesEncontrados.length === 0) {
          console.log(`🔍 "${termoPesquisa}" não encontrado localmente. Buscando lote na API Jikan...`);
          const respostaJikan = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(termoPesquisa)}&limit=10`);
          
          if (respostaJikan.status === 429) {
              return res.status(429).json({ error: "Muitas requisições à API pública. Aguarde um instante." });
          }

          const dadosJikan = await respostaJikan.json();

          if (dadosJikan.data && dadosJikan.data.length > 0) {
              for (const anime of dadosJikan.data) {
                  const generos = anime.genres ? anime.genres.map(g => g.name.toLowerCase()) : [];
                  if (generos.some(g => g.includes("hentai") || g.includes("erotica"))) continue;

                  const existePorId = await colecaoAnimes.findOne({ mal_id: anime.mal_id });
                  if (!existePorId) {
                      await colecaoAnimes.insertOne(anime);
                  }
              }

              animesEncontrados = await colecaoAnimes.find({
                  title: { $regex: termoPesquisa, $options: 'i' },
                  "genres.name": { $not: { $regex: "Hentai|Erotica", $options: "i" } }
              }).toArray();
          }
      }
    }

    const queryGlobal = {
      "genres.name": { $not: { $regex: "Hentai|Erotica", $options: "i" } }
    };

    if (categoriasFiltro.length > 0) {
      queryGlobal["genres.name"].$all = categoriasFiltro.map(cat => new RegExp(`^${cat}$`, "i"));
    }

    // Se achamos um anime de referência, fazemos o cruzamento de afinidades
    if (animesEncontrados.length > 0) {
      const animeReferencia = animesEncontrados[0];
      const generosAlvo = animeReferencia.genres ? animeReferencia.genres.map(g => g.name) : [];
      const temasAlvo = animeReferencia.themes ? animeReferencia.themes.map(t => t.name) : [];
      const demografiasAlvo = animeReferencia.demographics ? animeReferencia.demographics.map(d => d.name) : [];
      const idsFranquia = animesEncontrados.map(a => a.mal_id);

      const queryMatches = {
        $and: [
          { mal_id: { $nin: idsFranquia } },
          { title: { $not: { $regex: termoPesquisa, $options: 'i' } } },
          queryGlobal
        ]
      };

      const outrosAnimes = await colecaoAnimes.find(queryMatches).toArray();

      const resultadosDiretos = animesEncontrados.map(anime => {
          return { ...formatarResposta(anime), matchPercentage: 100, isMatchRecommendation: false };
      });

      const resultadosMatches = outrosAnimes.map(anime => {
          let score = 0;
          if (anime.genres) anime.genres.forEach(g => { if (generosAlvo.includes(g.name)) score += 3; });
          if (anime.themes) anime.themes.forEach(t => { if (temasAlvo.includes(t.name)) score += 3; });
          if (anime.demographics) anime.demographics.forEach(d => { if (demografiasAlvo.includes(d.name)) score += 2; });

          const porcentagem = score > 0 ? Math.min(99, 70 + (score * 2)) : 65;
          return { ...formatarResposta(anime), matchPercentage: porcentagem, isMatchRecommendation: true };
      })
      .filter(anime => anime.matchPercentage > 65)
      .sort((a, b) => b.matchPercentage - a.matchPercentage); // 🔴 .slice(0, 30) REMOVIDO AQUI

      return res.json([...resultadosDiretos, ...resultadosMatches]);
    } 
    
    // -------------------------------------------------------------------------
    // CASO B: O usuário está buscando APENAS clicando nas Tags (Sem digitar texto)
    // -------------------------------------------------------------------------
    else {
      // 🔴 .limit(40) REMOVIDO AQUI para trazer todos os resultados do banco de uma vez
      let animesPorCategoria = await colecaoAnimes.find(queryGlobal).toArray();

      if (animesPorCategoria.length === 0 && categoriasFiltro.length > 0) {
        console.log(`🔍 Tag "${categoriasFiltro[0]}" sem registros locais. Populando lote da API Jikan...`);
        const respostaJikanTag = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(categoriasFiltro[0])}&limit=15`);
        
        if (respostaJikanTag.ok) {
          const dadosJikanTag = await respostaJikanTag.json();
          if (dadosJikanTag.data) {
            for (const anime of dadosJikanTag.data) {
              const generos = anime.genres ? anime.genres.map(g => g.name.toLowerCase()) : [];
              if (generos.some(g => g.includes("hentai") || g.includes("erotica"))) continue;

              const existePorId = await colecaoAnimes.findOne({ mal_id: anime.mal_id });
              if (!existePorId) await colecaoAnimes.insertOne(anime);
            }
            // 🔴 .limit(40) REMOVIDO AQUI TAMBÉM após a atualização do banco
            animesPorCategoria = await colecaoAnimes.find(queryGlobal).toArray();
          }
        }
      }

      const resultadosFinais = animesPorCategoria.map(anime => {
        return { ...formatarResposta(anime), matchPercentage: 85, isMatchRecommendation: false };
      });

      return res.json(resultadosFinais);
    }

  } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: "Erro interno no servidor." });
  } finally {
      await client.close();
  }
});

// 🔄 ROTA ANIMES ALEATÓRIOS (Mantido o sample de 36 para a Home)
app.get('/api/home/animes-random', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('site_animes');
        const colecaoAnimes = database.collection('animes');
        
        const animesAleatorios = await colecaoAnimes.aggregate([
            { 
              $match: { 
                $and: [
                  { type: { $ne: null } },
                  { type: { $not: { $regex: "Movie", $options: "i" } } },
                  { type: { $in: ["TV", "OVA", "Special", "tv", "ova", "special"] } },
                  { "genres.name": { $not: { $regex: "Hentai|Erotica", $options: "i" } } }
                ]
              } 
            },
            { $sample: { size: 36 } }
        ]).toArray();
        
        res.json(animesAleatorios.map(anime => formatarResposta(anime)));
    } catch (erro) {
        res.status(500).json({ error: "Erro ao buscar animes aleatórios." });
    } finally {
        await client.close();
    }
});

// 🎬 ROTA FILMES ALEATÓRIOS (Mantido o sample original para a Home)
app.get('/api/home/filmes-random', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('site_animes');
        const colecaoAnimes = database.collection('animes');
        
        const filmesExclusivos = await colecaoAnimes.aggregate([
            { 
              $match: { 
                type: { $regex: "Movie", $options: "i" },
                "genres.name": { $not: { $regex: "Hentai|Erotica", $options: "i" } },
                $or: [
                  { "studios.name": { $regex: "Ghibli", $options: "i" } },
                  { "studios.name": { $regex: "CoMix Wave", $options: "i" } },
                  { "studios.name": { $regex: "Kyoto Animation", $options: "i" } }
                ]
              } 
            },
            { $sample: { size: 15 } }
        ]).toArray();

        let resultadoFinal = [...filmesExclusivos];

        if (resultadoFinal.length < 36) {
            const idsExistentes = resultadoFinal.map(f => f.mal_id);
            const outrosFilmes = await colecaoAnimes.aggregate([
                { 
                  $match: { 
                    type: { $regex: "Movie", $options: "i" }, 
                    mal_id: { $nin: idsExistentes },
                    "genres.name": { $not: { $regex: "Hentai|Erotica", $options: "i" } }
                  } 
                },
                { $sample: { size: 36 - resultadoFinal.length } }
            ]).toArray();
            resultadoFinal = [...resultadoFinal, ...outrosFilmes];
        }

        resultadoFinal.sort(() => Math.random() - 0.5);
        res.json(resultadoFinal.map(anime => formatarResposta(anime)));
    } catch (erro) {
        res.status(500).json({ error: "Erro ao buscar filmes aleatórios." });
    } finally {
        await client.close();
    }
});

app.listen(3000, () => {
  console.log('Servidor da API rodando com sucesso na porta 3000');
});
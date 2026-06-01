app.get('/api/recomendar', async (req, res) => {
  const fraseDoUsuario = req.query.termo || '';
  
  if (!fraseDoUsuario.trim()) {
    return res.status(400).json({ error: "Por favor, forneça um termo ou frase de pesquisa." });
  }

  try {
    await client.connect();
    const database = client.db('site_animes');
    const colecaoAnimes = database.collection('animes');

    let termoPesquisa = fraseDoUsuario
        .toLowerCase()
        .replace("eu gosto de", "")
        .replace("quero animes parecidos com", "")
        .replace("qual anime é parecido com", "")
        .trim();

    let animeAlvo = await colecaoAnimes.findOne({
        title: { $regex: termoPesquisa, $options: 'i' }
    });

    if (!animeAlvo) {
        console.log(`🔍 "${termoPesquisa}" não encontrado no banco local. Buscando na API Jikan...`);
        
        // O limite=1 aqui está correto porque você só quer achar o "Anime Alvo" digitado pelo usuário
        const respostaJikan = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(termoPesquisa)}&limit=1`);
        
        if (respostaJikan.status === 429) {
            return res.status(429).json({ error: "Muitas requisições à API pública. Aguarde um instante e tente novamente." });
        }

        const dadosJikan = await respostaJikan.json();

        if (!dadosJikan.data || dadosJikan.data.length === 0) {
            return res.status(404).json({ error: `Não encontrei nenhum anime com o nome "${termoPesquisa}" na internet.` });
        }

        const novoAnime = dadosJikan.data[0];

        const existePorId = await colecaoAnimes.findOne({ mal_id: novoAnime.mal_id });
        if (!existePorId) {
            await colecaoAnimes.insertOne(novoAnime);
            console.log(`💾 ${novoAnime.title} foi importado e salvo no MongoDB!`);
        }

        animeAlvo = novoAnime;
    }

    const generosAlvo = animeAlvo.genres ? animeAlvo.genres.map(g => g.name) : [];
    const temasAlvo = animeAlvo.themes ? animeAlvo.themes.map(t => t.name) : [];
    const demografiasAlvo = animeAlvo.demographics ? animeAlvo.demographics.map(d => d.name) : [];

    // Atenção: Se essa coleção tiver poucos itens, o match trará poucos itens!
    const todosAnimes = await colecaoAnimes.find({ mal_id: { $ne: animeAlvo.mal_id } }).toArray();

    const listaRecomendados = todosAnimes.map(anime => {
        let score = 0;
        if (anime.genres) anime.genres.forEach(g => { if (generosAlvo.includes(g.name)) score += 3; });
        if (anime.themes) anime.themes.forEach(t => { if (temasAlvo.includes(t.name)) score += 3; });
        if (anime.demographics) anime.demographics.forEach(d => { if (demografiasAlvo.includes(d.name)) score += 2; });

        return {
            title: anime.title,
            matchPercentage: score > 0 ? Math.min(99, 70 + (score * 2)) : 65,
            tags: anime.genres ? anime.genres.map(g => g.name) : [],
            studio: anime.studios && anime.studios[0] ? anime.studios[0].name : "Desconhecido",
            type: anime.type || "TV",
            episodes: anime.episodes || "Indefinido",
            rating: anime.score ? anime.score.toString() : "8.0",
            releaseYear: anime.aired && anime.aired.prop?.from?.year ? anime.aired.prop.from.year.toString() : "2020",
            synopsis: anime.synopsis || "Sinopse não cadastrada.",
            imageUrl: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || "",
            trailerUrl: anime.trailer?.embed_url || null
        };
    });

    const recomendacoesFinais = listaRecomendados
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 20); // 🚀 ALTERADO DE 8 PARA 20: Permite enviar mais opções para o front!

    res.json(recomendacoesFinais);

  } catch (erro) {
      console.error("Erro interno no servidor de recomendações:", erro);
      res.status(500).json({ error: "Erro interno no servidor de recomendações." });
  } finally {
      await client.close();
  }
});
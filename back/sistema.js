
require('dotenv').config(); 
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function buscarRecomendacoes(fraseDoUsuario) {
    try {
        await client.connect();
        const database = client.db('site_animes');
        const colecaoAnimes = database.collection('animes');

        // 1. Limpa a frase do usuário para pegar o termo de pesquisa
        let termoPesquisa = fraseDoUsuario
            .toLowerCase()
            .replace("eu gosto de", "")
            .replace("quero animes parecidos com", "")
            .replace("qual anime é parecido com", "")
            .trim();

        // 2. Busca o anime alvo usando o equivalente ao LIKE (%termoPesquisa%)
        const animeAlvo = await colecaoAnimes.findOne({
            title: { $regex: termoPesquisa, $options: 'i' } // 'i' para ser case-insensitive
        });

        if (!animeAlvo) {
            console.log(`\n❌ Erro: Não encontrei nenhum anime parecido com "${termoPesquisa}" no seu banco de dados.`);
            return;
        }

        console.log(`\n🔍 Anime Identificado no seu Banco: ${animeAlvo.title}`);
        console.log(`🏷️  Gêneros dele: ${animeAlvo.genres ? animeAlvo.genres.map(g => g.name).join(', ') : 'Nenhum'}`);

        // Extrai os arrays de nomes para cruzar no Aggregate
        const generosAlvo = animeAlvo.genres ? animeAlvo.genres.map(g => g.name) : [];
        const temasAlvo = animeAlvo.themes ? animeAlvo.themes.map(t => t.name) : [];
        const demografiasAlvo = animeAlvo.demographics ? animeAlvo.demographics.map(d => d.name) : [];

        // 3. PIPELINE DE AGGREGATION: Processa tudo no banco e traz todos os resultados de uma vez
        const pipeline = [
            {
                // Filtra para não trazer o próprio anime alvo
                $match: { mal_id: { $ne: animeAlvo.mal_id } }
            },
            {
                // Cria as regras de pontuação (Score) direto no banco
                $project: {
                    titulo: "$title",
                    compatibilidade: {
                        $add: [
                            // Calcula pontos de Gêneros (Se houver intersecção, multiplica o tamanho do array resultante por 3)
                            { $multiply: [ { $size: { $ifNull: [ { $setIntersection: [ { $ifNull: [ "$genres.name", [] ] }, generosAlvo ] }, [] ] } }, 3 ] },
                            // Calcula pontos de Temas (Multiplica por 3)
                            { $multiply: [ { $size: { $ifNull: [ { $setIntersection: [ { $ifNull: [ "$themes.name", [] ] }, temasAlvo ] }, [] ] } }, 3 ] },
                            // Calcula pontos de Demografias (Multiplica por 2)
                            { $multiply: [ { $size: { $ifNull: [ { $setIntersection: [ { $ifNull: [ "$demographics.name", [] ] }, demografiasAlvo ] }, [] ] } }, 2 ] }
                        ]
                    }
                }
            },
            {
                // Filtra para remover quem tem score 0 (nenhuma compatibilidade)
                $match: { compatibilidade: { $gt: 0 } }
            },
            {
                // Ordena do maior score para o menor (-1 significa Decrescente)
                $sort: { compatibilidade: -1, titulo: 1 }
            }
            // Sem $limit aqui para trazer ABSOLUTAMENTE TODOS os resultados de uma vez só!
        ];

        // Executa a query pesada direto no motor do MongoDB
        const todosRecomendados = await colecaoAnimes.aggregate(pipeline).toArray();

        console.log(`\n🎯 Aqui estão todas as recomendações encontradas (Total: ${todosRecomendados.length}):\n`);
        console.table(todosRecomendados); 

    } catch (erro) {
        console.error("Erro ao rodar o sistema:", erro);
    } finally {
        await client.close();
    }
}

// 🧪 Teste
buscarRecomendacoes("Eu gosto de Naruto");
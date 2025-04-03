import Musica from '../models/musicas.js';
import Repertorio from '../models/Repertorio.js';

export const salvarMusica = async (req, res) => {
    try {
        const { titulo, letra, tom, capotraste, categoria } = req.body;
        const repertorioId = '67eead00e7e6d86890b94205';

        // 1 - Upsert da música
        const musica = await Musica.findOneAndUpdate(
            { titulo: titulo },
            {
                letra,
                tom,
                capotraste,
                categoria: categoria.toUpperCase(),
                dataEnvio: new Date()
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // 2 - Buscar o repertório
        const repertorio = await Repertorio.findById(repertorioId);
        if (!repertorio) return res.status(404).json({ error: 'Repertório não encontrado' });

        // 3 - Verifica se a música já está no repertório
        const jaExiste = repertorio.musicas.some(m => m.equals(musica._id));

        if (!jaExiste) {
            repertorio.musicas.push(musica._id);
            await repertorio.save();
        }

        res.status(201).json({ message: 'Cifra salva/atualizada e repertório sincronizado', musica });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao salvar ou atualizar cifra' });
    }
};

export const listarMusicas = async (req, res) => {
    const musicas = await Musica.find().sort({ dataEnvio: -1 });
    res.json(musicas);
};

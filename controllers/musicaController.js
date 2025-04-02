import Musica from '../models/musicas.js';

export const salvarMusica = async (req, res) => {
    try {
        const { titulo, letra, tom, capotraste, categoria } = req.body;

        const result = await Musica.findOneAndUpdate(
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

        res.status(201).json({ message: 'Cifra salva ou atualizada com sucesso', musica: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao salvar ou atualizar cifra' });
    }
};

export const listarMusicas = async (req, res) => {
    const musicas = await Musica.find().sort({ dataEnvio: -1 });
    res.json(musicas);
};

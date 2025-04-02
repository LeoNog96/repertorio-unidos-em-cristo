import Musica from '../models/musicas.js';

export const salvarMusica = async (req, res) => {
    try {
        const musica = new Musica(req.body);
        await musica.save();
        res.status(201).json({ message: 'Cifra salva com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao salvar cifra' });
    }
};

export const listarMusicas = async (req, res) => {
    const musicas = await Musica.find().sort({ dataEnvio: -1 });
    res.json(musicas);
};

import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import musicaRoutes from './routes/musicaRoutes.js';
import { gerarPDF } from './services/pdfService.js';
import cors from 'cors';
import { gerarHTML } from './utils/htmlGenerator.js';
import Repertorio from './models/Repertorio.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🟢 MongoDB conectado'))
    .catch(err => console.error('🔴 Erro ao conectar no MongoDB', err));

app.use('/api/musicas', musicaRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'repertorio-completo.html'));
});

app.get('/exportar-pdf/:id', async (req, res) => {
    try {
        const repertorio = await Repertorio.findById(req.params.id).populate('musicas');
        if (!repertorio) return res.status(404).send("Repertório não encontrado");

        const html = gerarHTML(repertorio, repertorio.musicas);
        const outputPath = `./public/${repertorio.nome.replace(/\s+/g, "_")}.pdf`;

        await gerarPDF(html, outputPath);

        res.download(outputPath, `${repertorio.nome}.pdf`);
    } catch (err) {
        console.error('Erro ao gerar PDF', err);
        res.status(500).send("Erro ao gerar PDF");
    }
});

// Listar repertórios de um ministério
app.get('/repertorio/:id', async (req, res) => {
    const repertorio = await Repertorio.findById(req.params.id).populate('musicas');
    if (!repertorio) return res.status(404).send("Repertório não encontrado");

    const html = gerarHTML(repertorio, repertorio.musicas);
    res.send(html);
});


app.post('/api/repertorio', async (req, res) => {
    const repertorio = await Repertorio.create(req.body);
    res.status(201).json(repertorio);
});

app.post('/api/repertorio/:id/add-cifra', async (req, res) => {
    const { id } = req.params;
    const { cifraId } = req.body;

    const rep = await Repertorio.findById(id);
    if (!rep) return res.status(404).send("Repertório não encontrado");

    rep.musicas.push(cifraId);
    await rep.save();

    res.json(rep);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

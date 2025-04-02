import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import musicaRoutes from './routes/musicaRoutes.js';
import { gerarPDF } from './services/pdfService.js';
import cors from 'cors';

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

app.get('/exportar-pdf', async (req, res) => {
    try {
        const filePath = await gerarPDF();
        res.download(filePath, 'repertorio.pdf', (err) => {
            if (!err) fs.unlinkSync(filePath);
        });
    } catch (error) {
        console.error('Erro ao gerar PDF', error);
        res.status(500).send('Erro ao gerar PDF');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

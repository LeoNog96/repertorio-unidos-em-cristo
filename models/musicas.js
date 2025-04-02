import mongoose from 'mongoose';

const musicaSchema = new mongoose.Schema({
    titulo: { type: String, unique: true }, // índice único
    letra: String,
    tom: String,
    categoria: String,
    capotraste: Number,
    dataEnvio: { type: Date, default: Date.now }
});

export default mongoose.model('Musica', musicaSchema);

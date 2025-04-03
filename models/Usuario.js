import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    nome: String,
    email: String,
    password: String,
    ministerios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ministerio' }]
});

export default mongoose.model('Usuario', usuarioSchema);
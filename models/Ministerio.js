import mongoose from 'mongoose';

const ministerioSchema = new mongoose.Schema({
    nome: String,
    usuarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
    repertorioGeral: { type: mongoose.Schema.Types.ObjectId, ref: 'Repertorio' },
});

export default mongoose.model('Ministerio', ministerioSchema);

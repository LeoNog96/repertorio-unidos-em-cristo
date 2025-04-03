import mongoose from 'mongoose';

const repertorioSchema = new mongoose.Schema({
    nome: String,
    logoUrl: String,
    musicas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Musica' }]
});


export default mongoose.model('Repertorio', repertorioSchema);

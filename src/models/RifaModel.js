// Importa o mongoose, que é um ODM (Object Data Modeling) para MongoDB.
const mongoose = require('mongoose');

// Define o esquema da coleção 'rifas' utilizando o mongoose.Schema.
const rifaModel = mongoose.Schema(
    {
        // Define o campo 'rifaTitle' como uma string obrigatória.
        rifaTitle: { type: String, required: '{PATH} is required!' },
        
        // Define o campo 'rifaDescription' como uma string opcional.
        rifaDescription: { type: String },
        
        // Define o campo 'maxQuantityNumbers' como um número obrigatório.
        maxQuantityNumbers: { type: Number, required: '{PATH} is required' },
        
        // Define o campo 'rifaParticipants' como uma lista de ObjectIds referenciando a coleção 'Participante'.
        rifaParticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participante' }],
        
        // Define o campo 'totalChosenNumbers' como um número com valor padrão de 0.
        totalChosenNumbers: { type: Number, default: 0 } 
    },
    {
        // Define que os documentos devem armazenar timestamps de criação e modificação.
        timestamps: true
    }
);

// Exporta o modelo 'Rifa', associando-o ao esquema definido.
module.exports = mongoose.model('Rifa', rifaModel);

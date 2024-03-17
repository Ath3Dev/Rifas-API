// Importa o mongoose, que é um ODM (Object Data Modeling) para MongoDB.
const mongoose = require('mongoose');

// Define o esquema da coleção 'participantes' utilizando o mongoose.Schema.
const participanteModel = mongoose.Schema(
    {
        // Define o campo 'rifaId' como um ObjectId referenciando a coleção 'RifaModel', obrigatório.
        rifaId: { type: mongoose.Schema.Types.ObjectId, ref: 'RifaModel', required: true },

        // Define o campo 'name' como uma string obrigatória.
        name: { type: String, required: '{PATH} is required!' },

        // Define o campo 'chosenNumbers' como uma lista de números obrigatória.
        chosenNumbers: [{ type: Number, required: '{PATH is required!}, ' }],

        // Define o campo 'paymentStatus' como um booleano opcional.
        paymentStatus: { type: Boolean }
    },
    {
        // Define que os documentos devem armazenar timestamps de criação e modificação.
        timestamps: true
    }
);

// Exporta o modelo 'Participante', associando-o ao esquema definido.
module.exports = mongoose.model('Participante', participanteModel);

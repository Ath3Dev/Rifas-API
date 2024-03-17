const mongoose = require('mongoose');

const participanteModel = mongoose.Schema(
    {
        rifaId: { type: mongoose.Schema.Types.ObjectId, ref: 'RifaModel', required: true },
        name: { type: String, required: '{PATH} is required!'},
        chosenNumbers: [{ type: Number, required: '{PATH is required!}, ' }],
        paymentStatus: { type: Boolean }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Participante', participanteModel);
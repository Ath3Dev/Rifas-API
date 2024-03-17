const mongoose = require('mongoose');

const rifaModel = mongoose.Schema(
    {
        rifaTitle: { type: String, required: '{PATH} is required!' },
        rifaDescription: { type: String },
        maxQuantityNumbers: { type: Number, required: '{PATH} is required' },
        rifaParticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participante' }],
        totalChosenNumbers: { type: Number, default: 0 } 
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Rifa', rifaModel);
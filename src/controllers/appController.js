const rifaModel = require('../models/RifaModel');
const participanteModel = require('../models/ParticipanteModel');

module.exports = {
    async createRifa(req, res) {
        const { rifaTitle, rifaDescription, maxQuantityNumbers } = req.body;

        if (!rifaTitle || !rifaDescription || !maxQuantityNumbers) {
            return res.status(400).json({ msg: "Preencha todos os Campos!" });
        }

        try {
            const newRifa = await rifaModel.create({
                rifaTitle,
                rifaDescription,
                maxQuantityNumbers,
                totalChosenNumbers: 0
            });

            return res.status(201).json({ newRifa });
        } catch (error) { 
            console.log(error); 
            return res.status(500).json({ err: error });
        }
    },

    async createParticipante(req, res) {
        const { rifaId } = req.params;
        const { name, chosenNumbers, paymentStatus } = req.body;

        if (!name || !chosenNumbers || paymentStatus === undefined) {
            return res.status(400).json({ msg: "Preencha todos os Campos!" });
        }

        try {
            const rifa = await rifaModel.findById(rifaId);
            if (!rifa) {
                return res.status(404).json({ error: 'Rifa não encontrada.' });
            }

            for (const number of chosenNumbers) {
                if (number > rifa.maxQuantityNumbers) {
                    return res.status(400).json({ error: `O número ${number} está além do limite permitido pela rifa.` });
                }
            }

            const existingParticipant = await participanteModel.findOne({ rifaId, chosenNumbers });
            if (existingParticipant) {
                return res.status(400).json({ error: 'Esses números já foram escolhidos por outro participante nesta rifa.' });
            }

            await rifaModel.findByIdAndUpdate(rifaId, { $inc: { totalChosenNumbers: chosenNumbers.length } });

            const newParticipant = await participanteModel.create({
                rifaId,
                name,
                chosenNumbers,
                paymentStatus
            });

            await rifaModel.findByIdAndUpdate(rifaId, { $push: { rifaParticipants: newParticipant._id } });

            return res.status(201).json(newParticipant);

        } catch (error) { 
            console.log(error); 
            return res.status(500).json({ err: error });
        }
    },

    async readRifas(req, res) {
        try {
            const listRifas = await rifaModel.find();

            if (!listRifas || listRifas.length === 0) {
                return res.status(404).json({ msg: "Nenhuma rifa foi encontrada" })
            }

            return res.status(200).json({ listRifas });

        } catch (error) { 
            console.log(error); 
            return res.status(500).json({ err: error })
        }
    },

    async readRifa(req, res) {
        const { rifaId } = req.params;

        if (!rifaId) {
            return res.status(400).json({ msg: "ID Inválido" });
        }

        try {
            const findRifa = await rifaModel.findById(rifaId);
            if (!findRifa) {
                return res.status(404).json({ msg: "ID não encontrado" });
            }

            return res.status(200).json({ findRifa });

        } catch (error) { 
            console.log(error); 
            return res.status(500).json({ err: error });
        }
    },

    async readRifaParticipantes(req, res) {
        const { rifaId } = req.params;

        if (!rifaId) {
            return res.status(400).json({ msg: "ID Inválido" })
        }

        try {
            const findRifa = await rifaModel.findById(rifaId);
            if (!findRifa) {
                return res.status(404).json({ msg: "ID não encontrado" });
            }
            const listParticipants = await participanteModel.find({ rifaId: rifaId });

            if (!listParticipants || listParticipants.length === 0) {
                return res.status(404).json({ msg: "Nenhum participante encontrado!" });
            }

            return res.status(200).json({ listParticipants });
        } catch (error) { 
            console.log(error); 
            return res.status(500).json({ err: error });
        }
    },

    async readRifaParticipante(req, res) {
        const { rifaId, id } = req.params;

        if (!rifaId || !id) {
            return res.status(400).json({ msg: "IDs Inválidos" });
        }

        try {
            const findRifa = await rifaModel.findById(rifaId);
            if (!findRifa) {
                return res.status(404).json({ msg: "Rifa não encontrada" });
            }

            const findParticipant = await participanteModel.findOne({ rifaId: rifaId, _id: id });
            if (!findParticipant) {
                return res.status(404).json({ msg: "Participante não encontrado" });
            }

            return res.status(200).json({ findParticipant });

        } catch (error) { 
            console.log(error); 
            return res.status(500).json({ err: error });
        }
    },

    async updateRifa(req, res) {
        const { rifaId } = req.params;

        if (!rifaId) {
            return res.status(400).json({ msg: "ID Inválido" });
        }

        const { rifaTitle, rifaDescription, maxQuantityNumbers } = req.body;

        if (!rifaTitle || !rifaDescription || !maxQuantityNumbers) {
            return res.status(400).json({ msg: "Preencha todos os Campos!" })
        }

        try {
            const updatedRifa = await rifaModel.findByIdAndUpdate(rifaId, {
                rifaTitle,
                rifaDescription,
                maxQuantityNumbers
            }, { new: true });

            if (!updatedRifa) {
                return res.status(404).json({ msg: "Rifa não encontrada" });
            }

            return res.status(200).json({ msg: "Rifa atualizada com sucesso", updatedRifa });

        } catch (error) { 
            console.log(error);
            return res.status(500).json({ err: error })
        }
    },

    async updateParticipante(req, res) {
        const { rifaId, id } = req.params;

        if (!rifaId || !id) {
            return res.status(400).json({ msg: "IDs Inválidos" });
        }

        const { name, chosenNumbers, paymentStatus } = req.body;

        if (!name || !chosenNumbers || paymentStatus === undefined) {
            return res.status(400).json({ msg: "Preencha todos os Campos!" });
        }

        try {
            const rifa = await rifaModel.findById(rifaId);
            if (!rifa) {
                return res.status(404).json({ msg: "Rifa não encontrada" });
            }

            for (const number of chosenNumbers) {
                if (number > rifa.maxQuantityNumbers) {
                    return res.status(400).json({ error: `O número ${number} está além do limite permitido pela rifa.` });
                }
            }

            const existingParticipant = await participanteModel.findOne({ rifaId, chosenNumbers, _id: { $ne: id } });
            if (existingParticipant) {
                return res.status(400).json({ error: 'Esses números já foram escolhidos por outro participante nesta rifa.' });
            }

            const existingNumbers = await participanteModel.findOne({ rifaId, chosenNumbers: { $in: chosenNumbers }, _id: { $ne: id } });
            if (existingNumbers) {
                return res.status(400).json({ error: 'Alguns dos números escolhidos já foram selecionados por outro participante nesta rifa.' });
            }

            const updatedParticipant = await participanteModel.findByIdAndUpdate(id, {
                name,
                chosenNumbers,
                paymentStatus
            }, { new: true });

            if (!updatedParticipant) {
                return res.status(404).json({ msg: "Participante não encontrado" });
            }

            return res.status(200).json({ msg: "Participante atualizado com sucesso", updatedParticipant });

        } catch (error) { 
            console.log(error); 
            return res.status(500).json({ err: error });
        }
    },
    async deletarRifa(req, res) {
        const { rifaId } = req.params;

        if (!rifaId) {
            return res.status(400).json({ msg: "ID Inválido" });
        }

        try {
            const rifaDelete = await rifaModel.findByIdAndDelete(rifaId);
            if (!rifaDelete) {
                return res.status(404).json({ msg: "Rifa não encontrada" });
            }

            await participanteModel.deleteMany({ rifaId });

            return res.status(200).json({ msg: "Rifa e seus participantes deletados com sucesso" });

        } catch (error) { 
            console.log(error); 
            return res.status(500).json({ err: error });
        }
    },

    async deletarParticipante(req, res) {
        const { rifaId, id } = req.params;

        if (!rifaId || !id) {
            return res.status(400).json({ msg: "IDs Inválidos" });
        }

        try {
            const participanteDelete = await participanteModel.findOneAndDelete({ _id: id, rifaId });
            if (!participanteDelete) {
                return res.status(404).json({ msg: "Participante não encontrado" });
            }
            return res.status(200).json({ msg: "Participante deletado com sucesso!" });

        } catch (error) {
            console.log(error); 
            return res.status(500).json({ err: error });
        }
    }

};

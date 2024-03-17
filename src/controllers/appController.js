// Importa o modelo de rifa do arquivo correspondente.
const rifaModel = require('../models/RifaModel');

// Importa o modelo de participante do arquivo correspondente.
const participanteModel = require('../models/ParticipanteModel');

// Exporta um objeto contendo todas as funções para utilização em outros arquivos.
module.exports = {
    // Define a função assíncrona createRifa, que recebe a requisição e a resposta como parâmetros.
    async createRifa(req, res) {
        // Extrai os campos rifaTitle, rifaDescription e maxQuantityNumbers do corpo da requisição.
        const { rifaTitle, rifaDescription, maxQuantityNumbers } = req.body;

        // Verifica se algum campo obrigatório está faltando.
        if (!rifaTitle || !rifaDescription || !maxQuantityNumbers) {
            return res.status(400).json({ msg: "Preencha todos os Campos!" });
        }

        // Inicia um bloco try-catch para lidar com erros assíncronos.
        try {
            // Cria uma nova rifa com os dados fornecidos.
            const newRifa = await rifaModel.create({
                rifaTitle,
                rifaDescription,
                maxQuantityNumbers,
                totalChosenNumbers: 0
            });

            // Retorna um status 201 (Created) com os detalhes da nova rifa.
            return res.status(201).json({ newRifa });
        } catch (error) { // Captura qualquer erro ocorrido durante o processo.
            console.log(error); // Registra o erro no console para fins de depuração.
            // Retorna um erro 500 (Internal Server Error) com detalhes do erro.
            return res.status(500).json({ err: error });
        }
    },

    // Define a função assíncrona createParticipante, que recebe a requisição e a resposta como parâmetros.
    async createParticipante(req, res) {
        // Extrai o ID da rifa dos parâmetros da requisição.
        const { rifaId } = req.params;
        // Extrai os campos name, chosenNumbers e paymentStatus do corpo da requisição.
        const { name, chosenNumbers, paymentStatus } = req.body;

        // Verifica se algum campo obrigatório está faltando.
        if (!name || !chosenNumbers || paymentStatus === undefined) {
            return res.status(400).json({ msg: "Preencha todos os Campos!" });
        }

        // Inicia um bloco try-catch para lidar com erros assíncronos.
        try {
            // Busca a rifa pelo ID fornecido.
            const rifa = await rifaModel.findById(rifaId);
            // Verifica se a rifa foi encontrada.
            if (!rifa) {
                return res.status(404).json({ error: 'Rifa não encontrada.' });
            }

            // Verifica se algum número escolhido excede o limite permitido pela rifa.
            for (const number of chosenNumbers) {
                if (number > rifa.maxQuantityNumbers) {
                    return res.status(400).json({ error: `O número ${number} está além do limite permitido pela rifa.` });
                }
            }

            // Verifica se os números escolhidos já foram selecionados por outro participante nesta rifa.
            const existingParticipant = await participanteModel.findOne({ rifaId, chosenNumbers });
            if (existingParticipant) {
                return res.status(400).json({ error: 'Esses números já foram escolhidos por outro participante nesta rifa.' });
            }

            // Incrementa o contador de números escolhidos na rifa.
            await rifaModel.findByIdAndUpdate(rifaId, { $inc: { totalChosenNumbers: chosenNumbers.length } });

            // Cria um novo participante com os dados fornecidos.
            const newParticipant = await participanteModel.create({
                rifaId,
                name,
                chosenNumbers,
                paymentStatus
            });

            // Adiciona o ID do novo participante à lista de participantes da rifa.
            await rifaModel.findByIdAndUpdate(rifaId, { $push: { rifaParticipants: newParticipant._id } });

            // Retorna um status 201 (Created) com os detalhes do novo participante.
            return res.status(201).json(newParticipant);

        } catch (error) { // Captura qualquer erro ocorrido durante o processo.
            console.log(error); // Registra o erro no console para fins de depuração.
            // Retorna um erro 500 (Internal Server Error) com detalhes do erro.
            return res.status(500).json({ err: error });
        }
    },

    // Define a função assíncrona readRifas, que recebe a requisição e a resposta como parâmetros.
    async readRifas(req, res) {
        // Inicia um bloco try-catch para lidar com erros assíncronos.
        try {
            // Busca todas as rifas no banco de dados.
            const listRifas = await rifaModel.find();

            // Verifica se há rifas encontradas.
            if (!listRifas || listRifas.length === 0) {
                return res.status(404).json({ msg: "Nenhuma rifa foi encontrada" })
            }

            // Retorna um status 200 (OK) com a lista de rifas encontradas.
            return res.status(200).json({ listRifas });

        } catch (error) { // Captura qualquer erro ocorrido durante o processo.
            console.log(error); // Registra o erro no console para fins de depuração.
            // Retorna um erro 500 (Internal Server Error) com detalhes do erro.
            return res.status(500).json({ err: error })
        }
    },

    // Define a função assíncrona readRifa, que recebe a requisição e a resposta como parâmetros.
    async readRifa(req, res) {
        // Extrai o ID da rifa dos parâmetros da requisição.
        const { rifaId } = req.params;

        // Verifica se o ID é válido.
        if (!rifaId) {
            return res.status(400).json({ msg: "ID Inválido" });
        }

        // Inicia um bloco try-catch para lidar com erros assíncronos.
        try {
            // Busca a rifa pelo ID fornecido.
            const findRifa = await rifaModel.findById(rifaId);
            // Verifica se a rifa foi encontrada.
            if (!findRifa) {
                return res.status(404).json({ msg: "ID não encontrado" });
            }

            // Retorna a rifa encontrada.
            return res.status(200).json({ findRifa });

        } catch (error) { // Captura qualquer erro ocorrido durante o processo.
            console.log(error); // Registra o erro no console para fins de depuração.
            // Retorna um erro 500 (Internal Server Error) com detalhes do erro.
            return res.status(500).json({ err: error });
        }
    },

    // Define a função assíncrona readRifaParticipantes, que recebe a requisição e a resposta como parâmetros.
    async readRifaParticipantes(req, res) {
        // Extrai o ID da rifa dos parâmetros da requisição.
        const { rifaId } = req.params;

        // Verifica se o ID é válido.
        if (!rifaId) {
            return res.status(400).json({ msg: "ID Inválido" })
        }

        // Inicia um bloco try-catch para lidar com erros assíncronos.
        try {
            // Busca a rifa pelo ID fornecido.
            const findRifa = await rifaModel.findById(rifaId);
            // Verifica se a rifa foi encontrada.
            if (!findRifa) {
                return res.status(404).json({ msg: "ID não encontrado" });
            }
            // Busca todos os participantes associados à rifa.
            const listParticipants = await participanteModel.find({ rifaId: rifaId });

            // Verifica se há participantes associados à rifa.
            if (!listParticipants || listParticipants.length === 0) {
                return res.status(404).json({ msg: "Nenhum participante encontrado!" });
            }

            // Retorna a lista de participantes encontrados.
            return res.status(200).json({ listParticipants });
        } catch (error) { // Captura qualquer erro ocorrido durante o processo.
            console.log(error); // Registra o erro no console para fins de depuração.
            // Retorna um erro 500 (Internal Server Error) com detalhes do erro.
            return res.status(500).json({ err: error });
        }
    },

    // Define a função assíncrona readRifaParticipante, que recebe a requisição e a resposta como parâmetros.
    async readRifaParticipante(req, res) {
        // Extrai o ID da rifa e do participante dos parâmetros da requisição.
        const { rifaId, id } = req.params;

        // Verifica se os IDs são válidos.
        if (!rifaId || !id) {
            return res.status(400).json({ msg: "IDs Inválidos" });
        }

        // Inicia um bloco try-catch para lidar com erros assíncronos.
        try {
            // Busca a rifa pelo ID fornecido.
            const findRifa = await rifaModel.findById(rifaId);
            // Verifica se a rifa foi encontrada.
            if (!findRifa) {
                return res.status(404).json({ msg: "Rifa não encontrada" });
            }

            // Busca o participante pelo ID fornecido.
            const findParticipant = await participanteModel.findOne({ rifaId: rifaId, _id: id });
            // Verifica se o participante foi encontrado.
            if (!findParticipant) {
                return res.status(404).json({ msg: "Participante não encontrado" });
            }

            // Retorna o participante encontrado.
            return res.status(200).json({ findParticipant });

        } catch (error) { // Captura qualquer erro ocorrido durante o processo.
            console.log(error); // Registra o erro no console para fins de depuração.
            // Retorna um erro 500 (Internal Server Error) com detalhes do erro.
            return res.status(500).json({ err: error });
        }
    },

    // Define a função assíncrona updateRifa, que recebe a requisição e a resposta como parâmetros.
    async updateRifa(req, res) {
        // Extrai o ID da rifa dos parâmetros da requisição.
        const { rifaId } = req.params;

        // Verifica se o ID é válido.
        if (!rifaId) {
            return res.status(400).json({ msg: "ID Inválido" });
        }

        // Extrai os campos rifaTitle, rifaDescription e maxQuantityNumbers do corpo da requisição.
        const { rifaTitle, rifaDescription, maxQuantityNumbers } = req.body;

        // Verifica se algum campo obrigatório está faltando.
        if (!rifaTitle || !rifaDescription || !maxQuantityNumbers) {
            return res.status(400).json({ msg: "Preencha todos os Campos!" })
        }

        // Inicia um bloco try-catch para lidar com erros assíncronos.
        try {
            // Atualiza a rifa com os dados fornecidos.
            const updatedRifa = await rifaModel.findByIdAndUpdate(rifaId, {
                rifaTitle,
                rifaDescription,
                maxQuantityNumbers
            }, { new: true });

            // Verifica se a rifa foi encontrada.
            if (!updatedRifa) {
                return res.status(404).json({ msg: "Rifa não encontrada" });
            }

            // Retorna um status 200 (OK) com a mensagem de sucesso e os detalhes da rifa atualizada.
            return res.status(200).json({ msg: "Rifa atualizada com sucesso", updatedRifa });

        } catch (error) { // Captura qualquer erro ocorrido durante o processo.
            console.log(error); // Registra o erro no console para fins de depuração.
            // Retorna um erro 500 (Internal Server Error) com detalhes do erro.
            return res.status(500).json({ err: error })
        }
    },

    // Define a função assíncrona updateParticipante, que recebe a requisição e a resposta como parâmetros.
    async updateParticipante(req, res) {
        // Extrai os IDs da rifa e do participante dos parâmetros da requisição.
        const { rifaId, id } = req.params;

        // Verifica se os IDs são válidos.
        if (!rifaId || !id) {
            return res.status(400).json({ msg: "IDs Inválidos" });
        }

        // Extrai os campos name, chosenNumbers e paymentStatus do corpo da requisição.
        const { name, chosenNumbers, paymentStatus } = req.body;

        // Verifica se algum campo obrigatório está faltando.
        if (!name || !chosenNumbers || paymentStatus === undefined) {
            return res.status(400).json({ msg: "Preencha todos os Campos!" });
        }

        // Inicia um bloco try-catch para lidar com erros assíncronos.
        try {
            // Busca a rifa pelo ID fornecido.
            const rifa = await rifaModel.findById(rifaId);
            // Verifica se a rifa foi encontrada.
            if (!rifa) {
                return res.status(404).json({ msg: "Rifa não encontrada" });
            }

            // Verifica se os números escolhidos excedem o limite permitido pela rifa.
            for (const number of chosenNumbers) {
                if (number > rifa.maxQuantityNumbers) {
                    return res.status(400).json({ error: `O número ${number} está além do limite permitido pela rifa.` });
                }
            }

            // Verifica se os números escolhidos já foram selecionados por outro participante nesta rifa.
            const existingParticipant = await participanteModel.findOne({ rifaId, chosenNumbers, _id: { $ne: id } });
            if (existingParticipant) {
                return res.status(400).json({ error: 'Esses números já foram escolhidos por outro participante nesta rifa.' });
            }

            // Verifica se alguns dos números escolhidos já foram selecionados por outro participante nesta rifa.
            const existingNumbers = await participanteModel.findOne({ rifaId, chosenNumbers: { $in: chosenNumbers }, _id: { $ne: id } });
            if (existingNumbers) {
                return res.status(400).json({ error: 'Alguns dos números escolhidos já foram selecionados por outro participante nesta rifa.' });
            }

            // Atualiza o participante com os dados fornecidos.
            const updatedParticipant = await participanteModel.findByIdAndUpdate(id, {
                name,
                chosenNumbers,
                paymentStatus
            }, { new: true });

            // Verifica se o participante foi encontrado.
            if (!updatedParticipant) {
                return res.status(404).json({ msg: "Participante não encontrado" });
            }

            // Retorna um status 200 (OK) com a mensagem de sucesso e os detalhes do participante atualizado.
            return res.status(200).json({ msg: "Participante atualizado com sucesso", updatedParticipant });

        } catch (error) { // Captura qualquer erro ocorrido durante o processo.
            console.log(error); // Registra o erro no console para fins de depuração.
            // Retorna um erro 500 (Internal Server Error) com detalhes do erro.
            return res.status(500).json({ err: error });
        }
    },
    
    // Define a função assíncrona deletarRifa, que recebe a requisição e a resposta como parâmetros.
    async deletarRifa(req, res) {
        // Extrai o ID da rifa dos parâmetros da requisição.
        const { rifaId } = req.params;

        // Verifica se o ID é válido.
        if (!rifaId) {
            return res.status(400).json({ msg: "ID Inválido" });
        }

        // Inicia um bloco try-catch para lidar com erros assíncronos.
        try {
            // Busca e deleta a rifa pelo ID fornecido.
            const rifaDelete = await rifaModel.findByIdAndDelete(rifaId);
            // Verifica se a rifa foi encontrada.
            if (!rifaDelete) {
                return res.status(404).json({ msg: "Rifa não encontrada" });
            }

            // Deleta todos os participantes associados à rifa.
            await participanteModel.deleteMany({ rifaId });

            // Retorna um status 200 (OK) com a mensagem de sucesso.
            return res.status(200).json({ msg: "Rifa e seus participantes deletados com sucesso" });

        } catch (error) { // Captura qualquer erro ocorrido durante o processo.
            console.log(error); // Registra o erro no console para fins de depuração.
            // Retorna um erro 500 (Internal Server Error) com detalhes do erro.
            return res.status(500).json({ err: error });
        }
    },

    // Define a função assíncrona deletarParticipante, que recebe a requisição e a resposta como parâmetros.
    async deletarParticipante(req, res) {
        // Extrai os IDs da rifa e do participante dos parâmetros da requisição.
        const { rifaId, id } = req.params;

        // Verifica se os IDs são válidos.
        if (!rifaId || !id) {
            return res.status(400).json({ msg: "IDs Inválidos" });
        }

        // Inicia um bloco try-catch para lidar com erros assíncronos.
        try {
            // Busca e deleta o participante pelo ID fornecido.
            const participanteDelete = await participanteModel.findOneAndDelete({ _id: id, rifaId });
            // Verifica se o participante foi encontrado.
            if (!participanteDelete) {
                return res.status(404).json({ msg: "Participante não encontrado" });
            }
            // Retorna um status 200 (OK) com a mensagem de sucesso.
            return res.status(200).json({ msg: "Participante deletado com sucesso!" });

        } catch (error) { // Captura qualquer erro ocorrido durante o processo.
            console.log(error); // Registra o erro no console para fins de depuração.
            // Retorna um erro 500 (Internal Server Error) com detalhes do erro.
            return res.status(500).json({ err: error });
        }
    }

};

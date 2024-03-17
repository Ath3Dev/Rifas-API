const express = require('express');
const routes = express.Router();
const appController = require('../controllers/appController');

routes.post('/rifas/criar', appController.createRifa);
routes.post('/rifas/:rifaId/cadastrarParticipante', appController.createParticipante); // Definindo o parâmetro rifaId na URL
routes.get('/rifas', appController.readRifas);
routes.get('/rifas/:rifaId', appController.readRifa);
routes.get('/:rifaId/participantes/', appController.readRifaParticipantes);
routes.get('/:rifaId/participante/:id', appController.readRifaParticipante);
routes.put('/rifas/atualizar/:rifaId', appController.updateRifa);
routes.put('/rifas/atualizar/:rifaId/participante/:id', appController.updateParticipante);
routes.delete('/rifas/deletar/:rifaId', appController.deletarRifa);
routes.delete('rifas/deletar/:rifaId/participante/:id', appController.deletarParticipante);


module.exports = routes;

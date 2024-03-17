// Importa o módulo 'express' para instanciar um objeto Router.
const express = require('express');

// Instanciando um objeto Router para gerenciar as rotas.
const routes = express.Router();

// Importa o controlador 'appController' que contém as funções de manipulação das rotas.
const appController = require('../controllers/appController');

// Define a rota para criar uma nova rifa utilizando o método HTTP POST.
routes.post('/rifas/criar', appController.createRifa);

// Define a rota para cadastrar um novo participante em uma rifa específica utilizando o método HTTP POST.
routes.post('/rifas/:rifaId/cadastrarParticipante', appController.createParticipante); // Definindo o parâmetro rifaId na URL

// Define a rota para listar todas as rifas cadastradas utilizando o método HTTP GET.
routes.get('/rifas', appController.readRifas);

// Define a rota para obter os detalhes de uma rifa específica utilizando o método HTTP GET.
routes.get('/rifas/:rifaId', appController.readRifa);

// Define a rota para listar todos os participantes de uma rifa específica utilizando o método HTTP GET.
routes.get('/:rifaId/participantes/', appController.readRifaParticipantes);

// Define a rota para obter os detalhes de um participante específico de uma rifa específica utilizando o método HTTP GET.
routes.get('/:rifaId/participante/:id', appController.readRifaParticipante);

// Define a rota para atualizar os detalhes de uma rifa específica utilizando o método HTTP PUT.
routes.put('/rifas/atualizar/:rifaId', appController.updateRifa);

// Define a rota para atualizar os detalhes de um participante específico de uma rifa específica utilizando o método HTTP PUT.
routes.put('/rifas/atualizar/:rifaId/participante/:id', appController.updateParticipante);

// Define a rota para deletar uma rifa específica utilizando o método HTTP DELETE.
routes.delete('/rifas/deletar/:rifaId', appController.deletarRifa);

// Define a rota para deletar um participante específico de uma rifa específica utilizando o método HTTP DELETE.
routes.delete('rifas/deletar/:rifaId/participante/:id', appController.deletarParticipante);

// Exporta as rotas para serem utilizadas em outros arquivos.
module.exports = routes;

// Importa o framework Express, que é utilizado para criar o servidor HTTP.
const express = require('express');

// Carrega as variáveis de ambiente definidas no arquivo .env para process.env.
require("dotenv").config();

// Define a porta do servidor, utilizando a variável de ambiente PORT ou o valor padrão "8000".
const port = process.env.PORT || "8000";

// Cria uma instância do aplicativo Express.
const app = express();

// Importa as rotas definidas no arquivo routes.js.
const routes = require('./routes/routes');

// Importa as configurações do banco de dados definidas no arquivo dbConfig.js.
require('./config/dbConfig');

// Configura o aplicativo Express para interpretar JSON nas requisições.
app.use(express.json());

// Configura o aplicativo Express para usar as rotas importadas.
app.use(routes);

// Inicia o servidor HTTP para ouvir conexões na porta especificada.
app.listen(port, () => {
    // Imprime uma mensagem indicando que o servidor está funcionando e em qual porta.
    console.log(`Servidor funcionando em: http://localhost:${port}`);
});

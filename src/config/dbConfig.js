// Importa o mongoose, que é um ODM (Object Data Modeling) para MongoDB.
const mongoose = require('mongoose');

// Obtém o nome de usuário e a senha do banco de dados a partir das variáveis de ambiente.
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

// Define uma função assíncrona chamada config para configurar a conexão com o banco de dados.
const config = async () => {
    try {
        // Estabelece a conexão com o banco de dados MongoDB utilizando o nome de usuário e senha fornecidos.
        const dbConfig = await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPassword}@cluster0.rrllebe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
        );

        // Imprime uma mensagem de sucesso no console quando a conexão for estabelecida com sucesso.
        console.log("Conectou Mongo !");

        // Retorna a configuração do banco de dados.
        return dbConfig;
    } catch (error) {
        // Captura e imprime quaisquer erros que ocorram durante a conexão.
        console.log("error : " + error);
    }
};

// Chama a função de configuração para estabelecer a conexão com o banco de dados assim que o arquivo for carregado.
config();

// Exporta a função de configuração para ser utilizada em outros arquivos.
module.exports = config;

const mongoose = require('mongoose');

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

const config = async () => {
    try {
        const dbConfig = await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPassword}@cluster0.rrllebe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
        );
        console.log("Conectou Mongo !");
        return dbConfig;
    } catch (error) {
        console.log("error : " + error);
    }
};

config();

module.exports = config;

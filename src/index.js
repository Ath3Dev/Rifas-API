const express = require('express');
require("dotenv").config();

const port = process.env.PORT || "8000";

const app = express();

const routes = require('./routes/routes');

require('./config/dbConfig');

app.use(express.json());

app.use(routes);

app.listen(port, () => {
    console.log(`Servidor funcionando em: http://localhost:${port}`);
});

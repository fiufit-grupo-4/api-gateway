const dotenv = require('dotenv');
const { USER_ROUTES } = require("./user-routes");
const { TRAINING_ROUTES } = require("./training-routes");
const express = require('express')
const { setupLogging } = require("./logging");
const { setupProxies } = require("./proxy");
const { setupAuth } = require("./auth");
const cors = require('cors');

const { setupSwagger } = require("./swagger-docs-generation");

dotenv.config();

const app = express()
const port = process.env.PORT;

app.use(cors());


setupLogging(app);
setupSwagger(app);

setupAuth(app, USER_ROUTES);
setupProxies(app, USER_ROUTES);

setupAuth(app, TRAINING_ROUTES);
setupProxies(app, TRAINING_ROUTES);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})
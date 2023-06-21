const { USER_ROUTES } = require("./user-routes");
const { TRAINING_ROUTES } = require("./training-routes");
const { GOALS_ROUTES } = require("./goals-routes");
const { METRICS_ROUTES } = require("./metrics-routes");
const { setupLogging } = require("./logging");
const { setupProxies } = require("./proxy");
const { setupAuth } = require("./auth");
const { setupSwagger } = require("./swagger-docs-generation");
const dotenv = require('dotenv');
const express = require('express')
const cors = require('cors');

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

setupAuth(app, GOALS_ROUTES);
setupProxies(app, GOALS_ROUTES);

setupAuth(app, METRICS_ROUTES);
setupProxies(app, METRICS_ROUTES);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})
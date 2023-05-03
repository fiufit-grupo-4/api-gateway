const dotenv = require('dotenv');
const {USER_ROUTES} = require("./user-routes");
const {TRAINING_ROUTES} = require("./training-routes");
const express = require('express')
const {setupLogging} = require("./logging");
const {setupProxies} = require("./proxy");
const {setupAuth} = require("./auth");
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api-user-microservice-swagger.json');

dotenv.config();
const app = express()
app.use(cors());

const port = process.env.PORT;
const swaggerUiOptions = {
    explorer: true
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

setupLogging(app);

setupAuth(app, USER_ROUTES);
setupProxies(app, USER_ROUTES);

setupAuth(app, TRAINING_ROUTES);
setupProxies(app, TRAINING_ROUTES);

app.get('/hello', (req, resp) => {
    return resp.send('Hello World!');
})

app.get('/', (req, resp) => {
    return resp.send('OK');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
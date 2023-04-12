const dotenv = require('dotenv');
const {USER_ROUTES} = require("./user-routes");
const express = require('express')
const {setupLogging} = require("./logging");
const {setupProxies} = require("./proxy");
const {setupAuth} = require("./auth");

dotenv.config();

const app = express()
const port = process.env.PORT;

setupLogging(app);
setupAuth(app, USER_ROUTES);
setupProxies(app, USER_ROUTES);

app.get('/hello', (req, resp) => {
    return resp.send('Hello World!');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
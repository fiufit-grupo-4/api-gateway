const dotenv = require('dotenv');
const express = require('express')
const {setupLogging} = require("./logging");
const {USER_ROUTES} = require("./user-routes");
const {setupProxies} = require("./proxy");

dotenv.config();

const app = express()
const port = process.env.PORT;

setupLogging(app);
setupProxies(app, USER_ROUTES);

app.get('/hello', (req, resp) => {
    return resp.send('Hello World!');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
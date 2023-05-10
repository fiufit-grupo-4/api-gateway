const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const moment = require("moment");
const validator = require('validator');
const bodyParser = require('body-parser');
const { UserRoles } = require('./roles');


dotenv.config();

const validateAcessToken = (r, req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'NOT AUTHORIZED' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'NOT AUTHORIZED' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // TODO: complete JWT_SECRET at .env
        if (!decoded.exp || decoded.exp <= moment().unix() || !decoded.iat || decoded.iat > moment().unix()) {
            return res.status(401).json({ error: 'NOT AUTHORIZED' });
        }

        if (!decoded.id || !validator.isMongoId(decoded.id)) {
            return res.status(401).json({ error: 'NOT AUTHORIZED' });
        }
        
        if (!decoded.role || decoded.role > r.role) {
            return res.status(401).json({ error: 'NOT AUTHORIZED' });
        }

    } catch (err) {
        return res.status(401).json({ error: 'NOT AUTHORIZED' });
    }
}

const setupAuth = (app, routes) => {
    routes.forEach(r => {
        if (r.auth) {
            if (r.url === '/signup') {
                app.use('/signup', bodyParser.json(), bodyParser.urlencoded({ extended: true }), (req, res, next) => {
                    const body = req.body;
                    if (body.role == UserRoles.ADMIN) {
                        r.role = UserRoles.ADMIN; // No tenia asignado un rol inicialmente, pero para crear admin, debe ser admin
                        validateAcessToken(r, req, res);
                        console.log('NEW ADMIN CREATED');
                    }
                    next();
                });
            } else {
                app.use(r.url, (req, res, next) => {
                   validateAcessToken(r, req, res);
                   next();
                });
            }
        }
    });
}

exports.setupAuth = setupAuth;

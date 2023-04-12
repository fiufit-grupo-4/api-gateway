const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const setupAuth = (app, routes) => {
   routes.forEach(r => {
        if (r.auth) {
            app.use(r.url, (req, res, next) => {
                const authHeader = req.headers.authorization;
                if (!authHeader) {
                    return res.status(401).json({ error: 'Auth header not found' });
                }

                const token = authHeader.split(' ')[1];
                if (!token) {
                    return res.status(401).json({ error: 'Token not found in auth header' });
                }

                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET); // TODO: complete JWT_SECRET at .env
                    req.user = decoded; // "decoded" has data included when the token was generated
                    next();
                } catch (error) {
                    return res.status(401).json({ error: 'Invalid token' });
                }
            });
        }
    });
}

exports.setupAuth = setupAuth;
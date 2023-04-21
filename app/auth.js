const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const moment = require("moment");
const validator = require('validator');

dotenv.config();

const setupAuth = (app, routes) => {
   routes.forEach(r => {
        if (r.auth) {
            app.use(r.url, (req, res, next) => {
                const authHeader = req.headers.authorization;
                if (!authHeader) {
                    return res.status(401).json({ error: 'NOT AUTHORIZED. ACCESS TOKEN REQUIRED' });
                }

                const token = authHeader.split(' ')[1];
                if (!token) {
                    return res.status(401).json({ error: 'NOT AUTHORIZED. ACCESS TOKEN REQUIRED' });
                }

                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET); // TODO: complete JWT_SECRET at .env
                    if (!decoded.exp || decoded.exp <= moment().unix() || !decoded.iat || decoded.iat > moment().unix()) {
                        return res.status(401).json({ error: 'NOT AUTHORIZED. ACCESS TOKEN DENIED' });
                    }

                    if (!decoded.id) {
                        return res.status(401).json({ error: 'NOT AUTHORIZED. ACCESS TOKEN DENIED' });
                    }

                    if (!validator.isMongoId(decoded.id)) {
                        return res.status(401).json({ error: 'NOT AUTHORIZED. ACCESS TOKEN DENIED' });
                    }

                    req.user = decoded; // "decoded" has data included when the token was generated
                    next();
                } catch (err) {
                    return res.status(401).json({ error: 'NOT AUTHORIZED. ACCESS TOKEN DENIED' });
                }
            });
        }
    });
}

exports.setupAuth = setupAuth;

// la biblioteca JWT se asegura de que el token sea auténtico y no haya sido modificado, y 
// también decodifica el token para obtener la información almacenada en el payload. 
// Si el token es auténtico y no ha sido modificado, la biblioteca devolverá el payload del 
// token como un objeto. 

// Es responsabilidad del servidor validar y verificar si el payload es válido y corresponde
// a un usuario registrado en el servidor pero es algo COSTOSO si desde el API GATEWAY estamos
// consultando a la base de datos del user-microservice  a cada rato para validar el payload con 
// un usuario registrado.


// Podrías hacer una validación adicional en el servidor para verificar que los datos en el payload 
// del token son válidos y corresponden a un usuario registrado en tu base de datos. 
/// Por ejemplo, podrías agregar un campo en el payload que corresponda al ID del usuario y
// luego verificar si ese ID existe en tu base de datos antes de otorgar acceso al usuario.. PERO ESO ES COSTO!!

// También podrías agregar otros datos relevantes como roles o permisos y 
// validarlos en el servidor para garantizar que el usuario tiene los permisos
// adecuados para acceder a la información o realizar acciones específicas. 


// En general, es importante tener en cuenta que JWT solo garantiza la integridad y autenticidad del token, 
// pero no garantiza que los datos dentro del token sean válidos o estén autorizados para realizar 
// acciones específicas en tu servidor.
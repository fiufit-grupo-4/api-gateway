const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const swaggerUi = require('swagger-ui-express');

const setupSwagger = async (app) => {
    const usuariosSolicitud = fetch(process.env.USER_MICROSERVICE + '/openapi.json');
    const entrenamientosSolicitud = fetch(process.env.TRAINING_MICROSERVICE + '/openapi.json');

    try {
        const respuestas = await Promise.all([usuariosSolicitud, entrenamientosSolicitud]).then(values => {
            return Promise.all(values.map(value => value.json()));
        });
        const usuariosDocs = respuestas[0];
        const entrenamientosDocs = respuestas[1];

        let swaggerDocumentMerged = {
            "openapi": "3.0.2",
            "info": {
                "title": "API Gateway - FIUFIT",
                "version": "1.0.0"
            },
            "security": [
                {
                    "Authorization": []
                }
            ],
        }

        // no haria falta si se lo borra en user microservice
        delete usuariosDocs.paths["/"];
        
        // no haria falta si en user microservice se le agrega el tag a cada path! 
        // en training microservice ya esta eso
        for (const key in usuariosDocs.paths) {
            if (usuariosDocs.paths.hasOwnProperty(key)) {
                const element = usuariosDocs.paths[key];
                if (element.hasOwnProperty('post')) {
                    element.post.tags = ["General Routes - User microservice"];
                }
                if (element.hasOwnProperty('get')) {
                    element.get.tags = ["General Routes - User microservice"];
                }
                if (element.hasOwnProperty('put')) {
                    element.put.tags = ["General Routes - User microservice"];
                }
                if (element.hasOwnProperty('delete')) {
                    element.delete.tags = ["General Routes - User microservice"];
                }
                if (element.hasOwnProperty('patch')) {
                    element.patch.tags = ["General Routes - User microservice"];
                }
            }
        }

        swaggerDocumentMerged.paths = { ...usuariosDocs.paths, ...entrenamientosDocs.paths };
        const schemes = { ...usuariosDocs.components.schemas, ...entrenamientosDocs.components.schemas };
        swaggerDocumentMerged.components = {
            securitySchemes: {
                "Authorization": {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT",
                    "value": "Bearer <JWT token here>"
                }
            },
            schemas: schemes
        }

        // a las paths que comienzan con "login.." o la de "signup" se les agrega el security "security": []"
        // y se les quitaria el security de los demas
        for (const path in swaggerDocumentMerged.paths) {
            if (swaggerDocumentMerged.paths.hasOwnProperty(path)) {
                const properties = ["post", "get", "put", "delete", "patch"];
                const element = swaggerDocumentMerged.paths[path];

                properties.forEach(prop => {
                    if (element.hasOwnProperty(prop)) {
                        delete swaggerDocumentMerged.paths[path][prop].security;
                    }
                });
            }

            if (path.startsWith("/login") || path.startsWith("/signup")) {
                swaggerDocumentMerged.paths[path].post.security = [];
                swaggerDocumentMerged.paths[path].post.tags = ["Login & Signup - User microservice"];
            }
        }


        app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumentMerged));
    } catch (error) {
        console.error(error);
    }
}


exports.setupSwagger = setupSwagger;
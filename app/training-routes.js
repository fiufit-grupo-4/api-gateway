const dotenv = require('dotenv');
dotenv.config();

const { UserRoles } = require('./roles');

const trainingMicroserviceTarget = process.env.TRAINING_MICROSERVICE

const TRAINING_ROUTES = [
    {
        url: '/trainings',
        auth: false,
        role: UserRoles.ATLETA,
        proxy: {
            target: `${trainingMicroserviceTarget}/trainings/`,
            changeOrigin: true, // changes the origin of the host header to the target URL
            pathRewrite: {
                [`^/trainings`]: '',
            },
        }
    },
    {
        url: '/trainers/me/trainings',
        auth: true,
        role: UserRoles.TRAINER,
        proxy: {
            target: `${trainingMicroserviceTarget}/trainers/me/trainings/`,
            changeOrigin: true,
            pathRewrite: {
                [`^/trainers/me/trainings`]: '',
            },
        }
    },
    {
        url: '/trainings/:training_id',
        auth: false,
        role: UserRoles.ATLETA,
        proxy: {
            target: `${trainingMicroserviceTarget}`,
            changeOrigin: true,
            pathRewrite: {
                '^/trainings': '',
            },
            onProxyReq: (proxyReq, req, res) => {
                const { training_id } = req.params;
                proxyReq.path = `/trainings/${training_id}`;
            }
        }
    },
]

exports.TRAINING_ROUTES = TRAINING_ROUTES;
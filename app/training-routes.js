const dotenv = require('dotenv');
dotenv.config();

const { UserRoles } = require('./roles');

const trainingMicroserviceTarget = process.env.TRAINING_MICROSERVICE

const TRAINING_ROUTES = [
    {
        url: '/trainings',
        auth: true,
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
        url: '/athletes/me/trainings/:training_id/start',
        auth: true,
        role: UserRoles.ATLETA,
        proxy: {
            target: `${trainingMicroserviceTarget}`,
            changeOrigin: true,
            pathRewrite: {
                '^/athletes/me/trainings': '',
            },
            onProxyReq: (proxyReq, req, res) => {
                const { training_id } = req.params;
                proxyReq.path = `/athletes/me/trainings/${training_id}/start`;
            }
        }
    },
    {
        url: '/athletes/me/trainings/:training_id/stop',
        auth: true,
        role: UserRoles.ATLETA,
        proxy: {
            target: `${trainingMicroserviceTarget}`,
            changeOrigin: true,
            pathRewrite: {
                '^/athletes/me/trainings': '',
            },
            onProxyReq: (proxyReq, req, res) => {
                const { training_id } = req.params;
                proxyReq.path = `/athletes/me/trainings/${training_id}/stop`;
            }
        }
    },
    {
        url: '/athletes/me/trainings/:training_id/complete',
        auth: true,
        role: UserRoles.ATLETA,
        proxy: {
            target: `${trainingMicroserviceTarget}`,
            changeOrigin: true,
            pathRewrite: {
                '^/athletes/me/trainings': '',
            },
            onProxyReq: (proxyReq, req, res) => {
                const { training_id } = req.params;
                proxyReq.path = `/athletes/me/trainings/${training_id}/complete`;
            }
        }
    },
    {
        url: '/trainings/:training_id/block',
        auth: true,
        role: UserRoles.ADMIN,
        proxy: {
            target: `${trainingMicroserviceTarget}`,
            changeOrigin: true,
            pathRewrite: {
                '^/trainings': '',
            },
            onProxyReq: (proxyReq, req, res) => {
                const { training_id } = req.params;
                proxyReq.path = `/trainings/${training_id}/block`;
            }
        }
    },
    {
        url: '/trainings/:training_id/unblock',
        auth: true,
        role: UserRoles.ADMIN,
        proxy: {
            target: `${trainingMicroserviceTarget}`,
            changeOrigin: true,
            pathRewrite: {
                '^/trainings': '',
            },
            onProxyReq: (proxyReq, req, res) => {
                const { training_id } = req.params;
                proxyReq.path = `/trainings/${training_id}/unblock`;
            }
        }
    },
    {
        url: '/trainings/:training_id',
        auth: true,
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
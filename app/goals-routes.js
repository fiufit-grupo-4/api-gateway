const dotenv = require('dotenv');
dotenv.config();

const { UserRoles } = require('./roles');

const goalsMicroserviceTarget = process.env.GOALS_MICROSERVICE

const GOALS_ROUTES = [
    {
        url: '/goals',
        auth: true,
        role: UserRoles.ATLETA,
        proxy: {
            target: `${goalsMicroserviceTarget}/goals/`,
            changeOrigin: true, // changes the origin of the host header to the target URL
            pathRewrite: {
                [`^/goals`]: '',
            },
        }
    },
    {
        url: '/goals/:id_goal/start',
        auth: true,
        role: UserRoles.ATLETA,
        proxy: {
            target: `${goalsMicroserviceTarget}`,
            changeOrigin: true,
            pathRewrite: {
                '^/goals': '',
            },
            onProxyReq: (proxyReq, req, res) => {
                const { id_goal } = req.params;
                proxyReq.path = `/goals/${id_goal}/start`;
            }
        }
    },
    {
        url: '/goals/:id_goal/complete',
        auth: true,
        role: UserRoles.ATLETA,
        proxy: {
            target: `${goalsMicroserviceTarget}`,
            changeOrigin: true,
            pathRewrite: {
                '^/goals': '',
            },
            onProxyReq: (proxyReq, req, res) => {
                const { id_goal } = req.params;
                proxyReq.path = `/goals/${id_goal}/complete`;
            }
        }
    },
    {
        url: '/goals/:id_goal',
        auth: true,
        role: UserRoles.ATLETA,
        proxy: {
            target: `${goalsMicroserviceTarget}`,
            changeOrigin: true,
            pathRewrite: {
                '^/goals': '',
            },
            onProxyReq: (proxyReq, req, res) => {
                const { id_goal } = req.params;
                proxyReq.path = `/goals/${id_goal}`;
            }
        }
    },
]

exports.GOALS_ROUTES = GOALS_ROUTES;
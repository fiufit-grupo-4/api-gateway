const dotenv = require('dotenv');
dotenv.config();

const { UserRoles } = require('./roles');

const goalsMicroserviceTarget = process.env.GOALS_MICROSERVICE

const GOALS_ROUTES = [
    {
        url: '/athletes/me/goals',
        auth: true,
        role: UserRoles.ATLETA,
        proxy: {
            target: `${goalsMicroserviceTarget}/athletes/me/goals/`,
            changeOrigin: true, // changes the origin of the host header to the target URL
            pathRewrite: {
                [`^/athletes/me/goals`]: '',
            },
        }
    },
    {
        url: '/athletes/me/goals/:id_goal/start',
        auth: true,
        role: UserRoles.ATLETA,
        proxy: {
            target: `${goalsMicroserviceTarget}`,
            changeOrigin: true,
            pathRewrite: {
                '^/athletes/me/goals': '',
            },
            onProxyReq: (proxyReq, req, res) => {
                const { id_goal } = req.params;
                proxyReq.path = `/athletes/me/goals/${id_goal}/start`;
            }
        }
    },
    {
        url: '/athletes/me/goals/:id_goal/stop',
        auth: true,
        role: UserRoles.ATLETA,
        proxy: {
            target: `${goalsMicroserviceTarget}`,
            changeOrigin: true,
            pathRewrite: {
                '^/athletes/me/goals': '',
            },
            onProxyReq: (proxyReq, req, res) => {
                const { id_goal } = req.params;
                proxyReq.path = `/athletes/me/goals/${id_goal}/stop`;
            }
        }
    },
    {
        url: '/athletes/me/goals/:id_goal/complete',
        auth: true,
        role: UserRoles.ATLETA,
        proxy: {
            target: `${goalsMicroserviceTarget}`,
            changeOrigin: true,
            pathRewrite: {
                '^/athletes/me/goals': '',
            },
            onProxyReq: (proxyReq, req, res) => {
                const { id_goal } = req.params;
                proxyReq.path = `/athletes/me/goals/${id_goal}/complete`;
            }
        }
    },
    {
        url: '/athletes/me/goals/:id_goal',
        auth: true,
        role: UserRoles.ATLETA,
        proxy: {
            target: `${goalsMicroserviceTarget}`,
            changeOrigin: true,
            pathRewrite: {
                '^/athletes/me/goals': '',
            },
            onProxyReq: (proxyReq, req, res) => {
                const { id_goal } = req.params;
                proxyReq.path = `/athletes/me/goals/${id_goal}`;
            }
        }
    },
]

exports.GOALS_ROUTES = GOALS_ROUTES;
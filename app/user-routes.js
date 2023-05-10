const dotenv = require('dotenv');
dotenv.config();

const { UserRoles } = require('./roles');

const userMicroserviceTarget = process.env.USER_MICROSERVICE

const USER_ROUTES = [
    {
        url: '/login',
        auth: false,
        proxy: {
            target: `${userMicroserviceTarget}/login/`,
            changeOrigin: true, // changes the origin of the host header to the target URL
            pathRewrite: {
                [`^/login`]: '',
            },
        }
    },
    {
        url: '/signup',
        auth: true,
        proxy: {
            target: `${userMicroserviceTarget}/signup/`,
            changeOrigin: true, // changes the origin of the host header to the target URL
            pathRewrite: {
                [`^/signup`]: '',
            },
            onProxyReq : (proxyReq, req, res) => {
                const body = req.body;
                const jsonBody = JSON.stringify(body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(jsonBody));
                proxyReq.write(jsonBody);
            }
        }
        
    },
    {
        url: '/users',
        auth: true,
        role: UserRoles.ATLETA,
        proxy: {
            target: `${userMicroserviceTarget}/users/`,
            changeOrigin: true,
            pathRewrite: {
                [`^/users`]: '',
            },
        }
    },
    {
        url: '/users/:user_id/block',
        auth: true,
        role: UserRoles.ADMIN,
        proxy: {
            target: `${userMicroserviceTarget}`,
            changeOrigin: true,
            pathRewrite: {
                '^/users': '',
            },
            onProxyReq: (proxyReq, req, res) => {
                const { user_id } = req.params;
                proxyReq.path = `/users/${user_id}/block`;
            }
        }
    },
    {
        url: '/users/:user_id/unblock',
        auth: true,
        role: UserRoles.ADMIN,
        proxy: {
            target: `${userMicroserviceTarget}`,
            changeOrigin: true,
            pathRewrite: {
                '^/users': '',
            },
            onProxyReq: (proxyReq, req, res) => {
                const { user_id } = req.params;
                proxyReq.path = `/users/${user_id}/unblock`;
            }
        }
    },
    {
        url: '/users/:user_id',
        auth: true,
        role: UserRoles.ATLETA,
        creditCheck: true,
        proxy: {
            target: `${userMicroserviceTarget}`,
            changeOrigin: true,
            pathRewrite: {
                '^/users': '',
            },
            onProxyReq: (proxyReq, req, res) => {
                const { user_id } = req.params;
                proxyReq.path = `/users/${user_id}`;
            }
        }
    },
]

exports.USER_ROUTES = USER_ROUTES;
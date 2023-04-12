const dotenv = require('dotenv');
dotenv.config();

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
        url: '/users',
        auth: true,
        proxy: {
            target: `${userMicroserviceTarget}/users/`,
            changeOrigin: true,
            pathRewrite: {
                [`^/users`]: '',
            },
        }
    },
    {
        url: '/users/:user_id',
        auth: true,
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
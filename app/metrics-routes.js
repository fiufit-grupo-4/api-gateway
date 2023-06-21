const dotenv = require('dotenv');
dotenv.config();

const { UserRoles } = require('./roles');

const metricsMicroserviceTarget = process.env.METRICS_MICROSERVICE

const METRICS_ROUTES = [
    {
        url: '/history',
        auth: true,
        role: UserRoles.ADMIN,
        proxy: {
            target: `${metricsMicroserviceTarget}/history/`,
            changeOrigin: true, // changes the origin of the host header to the target URL
            pathRewrite: {
                [`^/history`]: '',
            },
        }
    },
]

exports.METRICS_ROUTES = METRICS_ROUTES;
const dotenv = require('dotenv');
dotenv.config();

const { USER_ROUTES } = require('../../app/user-routes');

describe('USER_ROUTES', () => {

  test('should set the correct proxy target for each route', () => {
    const targetPrefix = process.env.USER_MICROSERVICE;
    USER_ROUTES.forEach((route) => {
      expect(route.proxy.target).toMatch(targetPrefix);
    });
  });

  test('should set the correct path when using the users/:user_id route', () => {
    const route = USER_ROUTES.find((r) => r.url === '/users/:user_id');
    const req = { params: { user_id: 123 } };
    const proxyReq = { path: '' };
    const res = {};
    route.proxy.onProxyReq(proxyReq, req, res);
    expect(proxyReq.path).toBe('/users/123');
  });
});
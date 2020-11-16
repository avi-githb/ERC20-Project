"use strict";

var Koa = require('koa');

var Router = require('@koa/router'); //used to query different URL from frontend which is otherwise blocked from firewall


var cors = require('@koa/cors');

var ethers = require('ethers');

var PaymentProcessor = require('../build/contracts/PaymentProcessor.json');

var _require = require('db.js'),
    Payment = _require.Payment;

var app = new Koa();
var router = new Router();
router.get('/api/getPaymentId/:itemId', function _callee(ctx) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          ctx.body = 'hello world';

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.use(cors()).use(router.routes()).use(router.allowedMethods());
app.listen(4000, function () {
  console.log('Server running on port 4000');
});
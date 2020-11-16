"use strict";

var Koa = require('koa');

var Router = require('@koa/router'); //used to query different URL from frontend which is otherwise blocked from firewall


var cors = require('@koa/cors');

var ethers = require('ethers');

var PaymentProcessor = require('../frontend/src/contracts/PaymentProcessor.json');

var _require = require('./db.js'),
    Payment = _require.Payment;

var _require2 = require('ethers/lib/utils'),
    formatBytes32String = _require2.formatBytes32String;

var app = new Koa();
var router = new Router();
var items = {
  '1': {
    id: 1,
    url: 'https://UrlToDownloadItem1'
  },
  '2': {
    id: 2,
    url: 'https://UrlToDownloadItem2'
  }
};
router.get('/api/getPaymentId/:itemId', function _callee(ctx) {
  var paymentId;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          paymentId = (Math.random() * 10000).toFixed(0);
          _context.next = 3;
          return regeneratorRuntime.awrap(Payment.create({
            id: paymentId,
            itemId: ctx.params.itemid,
            paid: false
          }));

        case 3:
          ctx.body = {
            paymentId: paymentId
          };

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.get('/api/getItemUrl/:paymentId', function _callee2(ctx) {
  var payment;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Payment.findOne({
            id: ctx.params.paymentId
          }));

        case 2:
          payment = _context2.sent;

          if (payment && payment.paid == true) {
            ctx.body = {
              url: items[payment.itemId].url
            };
          } else {
            ctx.body = {
              url: ''
            };
          }

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.use(cors()).use(router.routes()).use(router.allowedMethods());
app.listen(4000, function () {
  console.log('Server running on port 4000');
});

var listentToEvents = function listentToEvents() {
  var provider = new ethers.providers.JsonRpcProvider('http://localhost:9545');
  var networkId = '5777';
  var paymentProcessor = new ethers.Contract(PaymentProcessor.networks[networkId].address, PaymentProcessor.abi, provider);
  paymentProcessor.on('PaymentDone', function _callee3(payer, amount, paymentId, date) {
    var payment;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log("\n       from ".concat(payer, "\n        amount ").concat(amount, "\n        paymentId ").concat(paymentId, "\n        date ").concat(new Date(date.toNumber() * 1000).toLocalString()));
            _context3.next = 3;
            return regeneratorRuntime.awrap(Payment.findOne({
              id: paymentId
            }));

          case 3:
            payment = _context3.sent;

            if (!payment) {
              _context3.next = 8;
              break;
            }

            paymentId.paid = true;
            _context3.next = 8;
            return regeneratorRuntime.awrap(payment.save());

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
};

listentToEvents();
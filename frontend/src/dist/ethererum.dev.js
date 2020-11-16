"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ethers = require("ethers");

var _PaymentProcessor = _interopRequireDefault(require("./contracts/PaymentProcessor.json"));

var _Dai = _interopRequireDefault(require("./contracts/Dai.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getBlockchian = function getBlockchian() {
  return new Promise(function (resolve, reject) {
    window.addEventListener('load', function _callee() {
      var provider, signer, paymentProcessor, dai;
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!window.ethereum) {
                _context.next = 8;
                break;
              }

              _context.next = 3;
              return regeneratorRuntime.awrap(window.ethereum.enable());

            case 3:
              provider = new _ethers.ethers.providers.Web3Provider(window.ethereum);
              signer = provider.getSigner();
              paymentProcessor = new _ethers.Contract(_PaymentProcessor["default"].networks[window.ethereum.networkVersion].address, _PaymentProcessor["default"].abi, signer);
              dai = new _ethers.Contract(_Dai["default"].networks[window.ethereum.networkVersion].address, _Dai["default"].abi, signer);
              resolve({
                provider: provider,
                paymentProcessor: paymentProcessor,
                dai: dai
              });

            case 8:
              resolve({
                provider: undefined,
                paymentProcessor: undefined,
                dai: undefined
              });

            case 9:
            case "end":
              return _context.stop();
          }
        }
      });
    });
  });
};

var _default = getBlockchian;
exports["default"] = _default;
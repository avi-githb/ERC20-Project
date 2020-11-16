pragma solidity ^0.6.2;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

//inheriting from ERC20 to use available methods
contract Dai is ERC20 {
constructor() ERC20('Dai Stablecoin', 'DAI') public{}

//this will create DAI token but IMP: this is only in localnet we can't create DAI on mainnet
function faucet(address to, uint amount)external {
    _mint(to, amount);
}
}
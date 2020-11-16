pragma solidity ^0.6.2;

//need to import openzeppelin to manipulate ERC20 token
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract PaymentProcessor{
//address of merchant
address public admin;

//pointer to DAI smartcontract
IERC20 public dai;

event PaymentDone(
    address payer,
    uint amount,
    uint paymentId,
    uint date
);

constructor(address adminAddress, address daiAddress) public{
    admin = adminAddress;
    dai = IERC20(daiAddress);
}

function pay(uint amount, uint paymentId) external{
    //allows us to transfer DAI ( we are using 1 of the method of DAI interface)
    dai.transferFrom(msg.sender, admin,amount);

    //emit an event
    //block.timestamp will give the time elapsed since last block was created 
    emit PaymentDone(msg.sender, amount, paymentId, block.timestamp);
}

}
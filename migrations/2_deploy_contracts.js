//import 2 contracts
const Dai = artifacts.require('./Dai.sol');
const PaymentProcessor = artifacts.require('./PaymentProcessor.sol');

//async func bcz we will use wait keyword
module.exports = async function (deployer, network, addresses) {
  const[admin, payer, _] = addresses;

    //this is for testing purpose we will create some fake DFAI tokens 
  if(network=== 'develop'){
      //sends transaction
      await deployer.deploy(Dai);
      //wait for transaction to mine
      const dai = await Dai.deployed();

      //create tokens for users
      //web3.util is used to convert wei to Dai.
      //lik 1 ether = 10^18 wei same: 1 dai = 10^18 wei
      await dai.faucet(payer, web3.utils.toWei('10000'));
      
      //deploy payment processor 
      await deployer.deploy(PaymentProcessor, admin, dai.address);
  }
  else{
      //this is for mainnet so we will only deploy patment processor and pass required parameters 
      const ADMIN_ADDRESS='';
      const DAI_ADDRESS='';
      await deployer.deploy(PaymentProcessor, ADMIN_ADDRESS, DAI_ADDRESS);
  }
    
};

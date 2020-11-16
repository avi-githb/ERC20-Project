const Koa = require('koa');
const Router = require('@koa/router');
//used to query different URL from frontend which is otherwise blocked from firewall
const cors = require('@koa/cors');
const ethers = require('ethers');
const PaymentProcessor = require('../frontend/src/contracts/PaymentProcessor.json');
const{Payment} = require('./db.js');
const { formatBytes32String } = require('ethers/lib/utils');

const app = new Koa();
const router = new Router();

const items = {
    '1': {id:1, url: 'https://UrlToDownloadItem1'},
    '2': {id:2, url: 'https://UrlToDownloadItem2'},
};

router.get('/api/getPaymentId/:itemId', async ctx=>{
    const paymentId = (Math.random()* 10000).toFixed(0);
    await Payment.create({
        id: paymentId,
        itemId: ctx.params.itemid,
        paid: false
    });
ctx.body = {
    paymentId: paymentId
}
});

router.get('/api/getItemUrl/:paymentId', async ctx =>{
    const payment = await Payment.findOne({id: ctx.params.paymentId});
if(payment && payment.paid== true){
    ctx.body = {
        url: items[payment.itemId].url
    };
}
    else{
        ctx.body={
            url: ''
        };
    }
});



app.use(cors()).use(router.routes()).use(router.allowedMethods());

app.listen(4000, ()=>{
    console.log('Server running on port 4000');
});

const listentToEvents = ()=> {
    const provider = new ethers.providers.JsonRpcProvider('http://localhost:9545');
    const networkId = '5777';

    const paymentProcessor = new ethers.Contract(PaymentProcessor.networks[networkId].address,PaymentProcessor.abi,
    provider
    );

    paymentProcessor.on('PaymentDone', async (payer,amount, paymentId, date)=>{
       console.log(`
       from ${payer}
        amount ${amount}
        paymentId ${paymentId}
        date ${(new Date(date.toNumber()*1000)).toLocalString()}`
       ); 
       const payment = await Payment.findOne({id: paymentId});
    if(payment){
        paymentId.paid = true;
        await payment.save();
    }
    });
};

listentToEvents();
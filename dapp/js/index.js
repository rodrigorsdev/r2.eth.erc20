
import Web3 from 'web3';
import R2Token from '../../build/contracts/R2Token.json';

let web3;
let contractInstance;
let connectedAccount;

let tokenName = '';
let tokenTotalSupply = 0;
let tokenSymbol = '';

let $transfer;
let $transferResult;

let $approve;
let $approveResult;

let $transferFrom;
let $transferFromResult;

let $allowance;
let $allowanceResult;

let $increaseApproval;
let $increaseApprovalResult;

let $decreaseApproval;
let $decreaseApprovalResult;

let $mintTo;
let $mintToResult;

let $burnFrom;
let $burnFromResult;

const initWeb3 = async () => {

    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        return new Web3(window.ethereum);
    }

    if (typeof window.web3 !== 'undefined') {
        return new Web3(window.web3.currentProvider);
    }

    return new Web3('http://localhost:9545');
};

const initContract = () => {
    const deploymentKey = Object.keys(R2Token.networks)[0];
    return new web3.eth.Contract(
        R2Token.abi,
        R2Token
            .networks[deploymentKey]
            .address
    );
};

const setTotalSupply = async () => {
    const $tokenTotalsupply = document.getElementById('tokenTotalsupply');
    const $tokenSymbol = document.getElementById('tokenSymbol');

    const totalSypply = await contractInstance.methods.totalSupply().call();
    tokenSymbol = await contractInstance.methods.symbol().call();

    $tokenTotalsupply.innerHTML = totalSypply;
    $tokenSymbol.innerHTML = tokenSymbol;
}

const setBalanceOf = async () => {
    const $walletBalance = document.getElementById('walletBalance');
    const $walletBalanceSymbol = document.getElementById('walletBalanceSymbol');

    const balanceOf = await contractInstance.methods.balanceOf(connectedAccount).call();

    $walletBalance.innerHTML = balanceOf;
    $walletBalanceSymbol.innerHTML = ' ' + tokenSymbol;
}

const registerTransferForm = async () => {
    $transfer = document.getElementById('transfer');
    $transferResult = document.getElementById('transfer-result');

    $transfer.addEventListener('submit', async (e) => {
        e.preventDefault();

        const to = e.target.elements[0].value;
        const value = e.target.elements[1].value;

        try {
            await contractInstance.methods.transfer(to, value).send({ from: connectedAccount });
            $transferResult.innerHTML = 'transfer ' + amount + ' ' + tokenSymbol + ' To ' + to;
        } catch (err) {
            $transferResult.innerHTML = 'transfer error: ' + err.message;
        }

        await setBalanceOf();
    });
};

const registerMintToForm = async () => {
    $mintTo = document.getElementById('mintTo');
    $mintToResult = document.getElementById('mintTo-result');

    $mintTo.addEventListener('submit', async (e) => {
        e.preventDefault();

        const to = e.target.elements[0].value;
        const amount = e.target.elements[1].value;

        try {
            await contractInstance.methods.mintTo(to, amount).send({ from: connectedAccount });
            $mintToResult.innerHTML = 'mint ' + amount + ' To ' + to;
        } catch (err) {
            $mintToResult.innerHTML = 'mintTo error: ' + err.message;
        }

        await setTotalSupply();
        await setBalanceOf();
    });
};

const registerBurnFrom = async () => {
    $burnFrom = document.getElementById('burnFrom');
    $burnFromResult = document.getElementById('burnFrom-result');

    $burnFrom.addEventListener('submit', async (e) => {
        e.preventDefault();

        const from = e.target.elements[0].value;
        const amount = e.target.elements[1].value;

        try {
            await contractInstance.methods.burnFrom(from, amount).send({ from: connectedAccount });
            $burnFromResult.innerHTML = 'burn ' + amount + ' from ' + to;
        } catch (err) {
            $burnFromResult.innerHTML = 'burnFrom error: ' + err.message;
        }

        await setTotalSupply();
        await setBalanceOf();
    });
};

const init = async () => {
    let accounts = [];

    const $tokenName = document.getElementById('tokenName');
    const $walletAddress = document.getElementById('walletAddress');

    accounts = await web3.eth.getAccounts();
    connectedAccount = accounts[0];

    $walletAddress.innerHTML = connectedAccount;

    await setTotalSupply();
    await setBalanceOf();
    
    await registerMintToForm();
    await registerBurnFrom();
    await registerTransferForm();
};

document.addEventListener('DOMContentLoaded', async () => {
    web3 = await initWeb3();
    contractInstance = initContract();
    await init();
});

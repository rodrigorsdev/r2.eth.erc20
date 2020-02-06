
import Web3 from 'web3';
import R2Token from '../../build/contracts/R2Token.json';

import { registerTransferForm, clearTransferModal } from './transfer.js';

let web3;
let contractInstance;
let connectedAccount;

let tokenName = '';
let tokenTotalSupply = 0;
let tokenSymbol = '';

let $transferForm;
let $transferSubmit;
let $transferMessageSuccess;
let $transferMessageSuccessText;
let $transferMessageDanger;
let $transferMessageDangerText;

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

const registerElements = () => {
    $transferForm = document.getElementById('transfer');
    $transferSubmit = document.getElementById('tranferSubmit');
    $transferMessageSuccess = document.getElementById('transfer-result-success');
    $transferMessageSuccessText = document.getElementById('transfer-result-success-text');
    $transferMessageDanger = document.getElementById('transfer-result-danger');
    $transferMessageDangerText = document.getElementById('transfer-result-danger-text');
};

const setTokenName = async () => {
    const $tokenName = document.getElementById('tokenName');
    tokenName = await contractInstance.methods.name().call();
    $tokenName.innerHTML = tokenName;
};

const setConnectedWallet = async () => {
    let accounts = [];

    const $walletAddress = document.getElementById('walletAddress');

    accounts = await web3.eth.getAccounts();
    connectedAccount = accounts[0];

    $walletAddress.innerHTML = connectedAccount;
};

const setTotalSupply = async () => {
    const $tokenTotalsupply = document.getElementById('tokenTotalsupply');
    const $tokenSymbol = document.getElementById('tokenSymbol');

    tokenTotalSupply = await contractInstance.methods.totalSupply().call();
    tokenSymbol = await contractInstance.methods.symbol().call();

    $tokenTotalsupply.innerHTML = tokenTotalSupply;
    $tokenSymbol.innerHTML = tokenSymbol;
}

const init = async () => {
    try {
        registerElements();

        await setTokenName();
        await setTotalSupply();

        await setConnectedWallet();

        await registerTransferForm(
            $transferForm,
            $transferSubmit,
            $transferMessageSuccess,
            $transferMessageSuccessText,
            $transferMessageDanger,
            $transferMessageDangerText,
            contractInstance,
            connectedAccount
        );

        clearTransferModal();

    } catch (err) {
        console.error(err.message);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    web3 = await initWeb3();
    contractInstance = initContract();
    await init();
});

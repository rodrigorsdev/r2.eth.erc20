
import Web3 from 'web3';
import R2Token from '../../build/contracts/R2Token.json';

import { setTokenInfo } from './token.js';
import { registerConnectedWalletElements, setConnectedWallet, connectedAccount, setConnectedWalletBalance } from './account.js';

import { registerBalanceOfElements, clearBalanceOfForm, balanceOfFormSubmit } from './balanceOf.js';
import { registerAllowanceElements, clearAllowanceForm, allowanceFormSubmit } from './allowance';

import { registerTranferElements, clearTransferFormModal, registerTransferFormSubmit } from './transfer.js';

let web3;
let contractInstance;

let $tokenName;
let $tokenTotalsupply;
let $tokenSymbol;

let $walletAddress;
let $walletBalance;

let $balanceOfForm;
let $balanceOfMessageSuccess;
let $balanceOfMessageSuccessText;
let $balanceOfMessageDanger;
let $balanceOfMessageDangerText;

let $allowanceForm;
let $allowanceMessageSuccess;
let $allowanceMessageSuccessText;
let $allowanceMessageDanger;
let $allowanceMessageDangerText;

let $transferForm;
let $transferMessageSuccess;
let $transferMessageSuccessText;
let $transferMessageDanger;
let $transferMessageDangerText;

const initWeb3 = async () => {
    if (typeof web3 !== 'undefined') {
        return new Web3(web3.currentProvider);
    } else {
        return new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }
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
    $tokenName = document.getElementById('tokenName');
    $tokenTotalsupply = document.getElementById('tokenTotalsupply');
    $tokenSymbol = document.getElementById('tokenSymbol');

    $walletAddress = document.getElementById('walletAddress');
    $walletBalance = document.getElementById('walletBalance');

    $balanceOfForm = document.getElementById('balanceOf');
    $balanceOfMessageSuccess = document.getElementById('balanceOf-result-success');
    $balanceOfMessageSuccessText = document.getElementById('balanceOf-result-success-text');
    $balanceOfMessageDanger = document.getElementById('balanceOf-result-danger');
    $balanceOfMessageDangerText = document.getElementById('balanceOf-result-danger-text');

    $allowanceForm = document.getElementById('allowance');
    $allowanceMessageSuccess = document.getElementById('allowance-result-success');
    $allowanceMessageSuccessText = document.getElementById('allowance-result-success-text');
    $allowanceMessageDanger = document.getElementById('allowance-result-danger');
    $allowanceMessageDangerText = document.getElementById('allowance-result-danger-text');

    $transferForm = document.getElementById('transfer');
    $transferMessageSuccess = document.getElementById('transfer-result-success');
    $transferMessageSuccessText = document.getElementById('transfer-result-success-text');
    $transferMessageDanger = document.getElementById('transfer-result-danger');
    $transferMessageDangerText = document.getElementById('transfer-result-danger-text');
};

const init = async () => {
    try {

        registerElements();

        //token
        await setTokenInfo(
            $tokenName,
            $tokenTotalsupply,
            $tokenSymbol,
            contractInstance
        );

        //account
        registerConnectedWalletElements(
            $walletAddress,
            $walletBalance,
            web3,
            contractInstance
        );
        await setConnectedWallet();
        await connectedAccount();
        await setConnectedWalletBalance();

        //balanceOf
        registerBalanceOfElements(
            $balanceOfForm,
            $balanceOfMessageSuccess,
            $balanceOfMessageSuccessText,
            $balanceOfMessageDanger,
            $balanceOfMessageDangerText,
            contractInstance
        );
        clearBalanceOfForm();
        await balanceOfFormSubmit();

        //allowance
        registerAllowanceElements(
            $allowanceForm,
            $allowanceMessageSuccess,
            $allowanceMessageSuccessText,
            $allowanceMessageDanger,
            $allowanceMessageDangerText,
            contractInstance
        );
        clearAllowanceForm();
        await allowanceFormSubmit();

        //transfer
        registerTranferElements(
            $transferForm,
            $transferMessageSuccess,
            $transferMessageSuccessText,
            $transferMessageDanger,
            $transferMessageDangerText,
            contractInstance,
            connectedAccount
        );
        clearTransferFormModal();
        await registerTransferFormSubmit();
    } catch (err) {
        console.error(err.message);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    web3 = await initWeb3();
    contractInstance = initContract();
    await init();
});

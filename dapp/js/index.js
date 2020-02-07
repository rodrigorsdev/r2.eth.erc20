import Web3 from 'web3';
import R2Token from '../../build/contracts/R2Token.json';

import { setTokenInfo } from './functions/token';
import { registerConnectedWalletElements, setConnectedWallet, connectedAccount, setConnectedWalletBalance } from './functions/account';

import { registerBalanceOfElements, clearBalanceOfForm, balanceOfFormSubmit } from './functions/balanceOf';
import { registerAllowanceElements, clearAllowanceForm, allowanceFormSubmit } from './functions/allowance';

import { registerTranferElements, clearTransferFormModal, registerTransferFormSubmit } from './functions/transfer';
import { registerTranferFromElements, clearTransferFromFormModal, registerTransferFromFormSubmit } from './functions/transferFrom';
import { registerApproveElements, clearApproveFormModal, registerApproveFormSubmit } from './functions/approve';
import { registerIncreaseApprovalElements, clearIncreaseApprovalFormModal, registerIncreaseApprovalFormSubmit } from './functions/increaseApproval';
import { registerDecreaseApprovalElements, clearDecreaseApprovalFormModal, registerDecreaseApprovalFormSubmit } from './functions/decreaseApproval';

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

let $transferFromForm;
let $transferFromMessageSuccess;
let $transferFromMessageSuccessText;
let $transferFromMessageDanger;
let $transferFromMessageDangerText;

let $approveForm;
let $approveMessageSuccess;
let $approveMessageSuccessText;
let $approveMessageDanger;
let $approveMessageDangerText;

let $increaseApprovalForm;
let $increaseApprovalMessageSuccess;
let $increaseApprovalMessageSuccessText;
let $increaseApprovalMessageDanger;
let $increaseApprovalMessageDangerText;

let $decreaseApprovalForm;
let $decreaseApprovalMessageSuccess;
let $decreaseApprovalMessageSuccessText;
let $decreaseApprovalMessageDanger;
let $decreaseApprovalMessageDangerText;

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

    $transferFromForm = document.getElementById('transferFrom');
    $transferFromMessageSuccess = document.getElementById('transferFrom-result-success');
    $transferFromMessageSuccessText = document.getElementById('transferFrom-result-success-text');
    $transferFromMessageDanger = document.getElementById('transferFrom-result-danger');
    $transferFromMessageDangerText = document.getElementById('transferFrom-result-danger-text');

    $approveForm = document.getElementById('approve');
    $approveMessageSuccess = document.getElementById('approve-result-success');
    $approveMessageSuccessText = document.getElementById('approve-result-success-text');
    $approveMessageDanger = document.getElementById('approve-result-danger');
    $approveMessageDangerText = document.getElementById('approve-result-danger-text');

    $increaseApprovalForm = document.getElementById('increaseApproval');
    $increaseApprovalMessageSuccess = document.getElementById('increaseApproval-result-success');
    $increaseApprovalMessageSuccessText = document.getElementById('increaseApproval-result-success-text');
    $increaseApprovalMessageDanger = document.getElementById('increaseApproval-result-danger');
    $increaseApprovalMessageDangerText = document.getElementById('increaseApproval-result-danger-text');

    $decreaseApprovalForm = document.getElementById('decreaseApproval');
    $decreaseApprovalMessageSuccess = document.getElementById('decreaseApproval-result-success');
    $decreaseApprovalMessageSuccessText = document.getElementById('decreaseApproval-result-success-text');
    $decreaseApprovalMessageDanger = document.getElementById('decreaseApproval-result-danger');
    $decreaseApprovalMessageDangerText = document.getElementById('decreaseApproval-result-danger-text');
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
            contractInstance
        );
        clearTransferFormModal();
        await registerTransferFormSubmit();

        //transferFrom
        registerTranferFromElements(
            $transferFromForm,
            $transferFromMessageSuccess,
            $transferFromMessageSuccessText,
            $transferFromMessageDanger,
            $transferFromMessageDangerText,
            contractInstance
        );
        clearTransferFromFormModal();
        await registerTransferFromFormSubmit();

        //approve
        registerApproveElements(
            $approveForm,
            $approveMessageSuccess,
            $approveMessageSuccessText,
            $approveMessageDanger,
            $approveMessageDangerText,
            contractInstance
        );
        clearApproveFormModal();
        await registerApproveFormSubmit();

        //increase approval
        registerIncreaseApprovalElements(
            $increaseApprovalForm,
            $increaseApprovalMessageSuccess,
            $increaseApprovalMessageSuccessText,
            $increaseApprovalMessageDanger,
            $increaseApprovalMessageDangerText,
            contractInstance
        );
        clearIncreaseApprovalFormModal();
        await registerIncreaseApprovalFormSubmit();

         //decrease approval
         registerDecreaseApprovalElements(
            $decreaseApprovalForm,
            $decreaseApprovalMessageSuccess,
            $decreaseApprovalMessageSuccessText,
            $decreaseApprovalMessageDanger,
            $decreaseApprovalMessageDangerText,
            contractInstance
        );
        clearDecreaseApprovalFormModal();
        await registerDecreaseApprovalFormSubmit();

    } catch (err) {
        console.error(err.message);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    web3 = await initWeb3();
    contractInstance = initContract();
    await init();
});

import { initEthers } from './connection/ethers';
import { initEthersContract } from './connection/contract';

import { registerTokenElements, setTokenInfo, setTotalSupply } from './token/token';
import { registerConnectedWalletElements, setConnectedWallet, connectedAccount, setConnectedWalletBalance } from './token/account';

import { registerBalanceOfElements, clearBalanceOfForm, balanceOfFormSubmit } from './token/balanceOf';
import { registerAllowanceElements, clearAllowanceForm, allowanceFormSubmit } from './token/allowance';

import { registerTranferElements, clearTransferFormModal, registerTransferFormSubmit } from './token/transfer';
import { registerTranferFromElements, clearTransferFromFormModal, registerTransferFromFormSubmit } from './token/transferFrom';
import { registerApproveElements, clearApproveFormModal, registerApproveFormSubmit } from './token/approve';
import { registerIncreaseApprovalElements, clearIncreaseApprovalFormModal, registerIncreaseApprovalFormSubmit } from './token/increaseApproval';
import { registerDecreaseApprovalElements, clearDecreaseApprovalFormModal, registerDecreaseApprovalFormSubmit } from './token/decreaseApproval';

import { registerMintToElements, clearMintToFormModal, registerMintToFormSubmit } from './token/mintTo';
import { registerBurnFromElements, clearBurnFromFormModal, registerBurnFromFormSubmit } from './token/burnFrom';

import { registerLifecycleElements, getLifecycleStatus, registerLifecycleFormSubmit } from './lifecycle/status';

import { registerVerifyRoleElements, clearVerifyRoleFormModal, registerVerifyRoleFormSubmit } from './roles/verifyRole';
import { registerAddRoleElements, clearAddRoleFormModal, registerAddRoleFormSubmit } from './roles/AddRole';
import { registerRemoveRoleElements, clearRemoveRoleFormModal, registerRemoveRoleFormSubmit } from './roles/removeRole';

let ethers;
let contractInstance;

let $connectedNetwork;
let $contractAddress;

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

let $mintToForm;
let $mintToMessageSuccess;
let $mintToMessageSuccessText;
let $mintToMessageDanger;
let $mintToMessageDangerText;

let $burnFromForm;
let $burnFromMessageSuccess;
let $burnFromMessageSuccessText;
let $burnFromMessageDanger;
let $burnFromMessageDangerText;

let $lifecycleForm;
let $lifecycleStatus;
let $lifecycleButtons;
let $lifecycleStatusInput;
let $lifecycleStatusIndex;
let $lifecycleStatusIndexDiv;

let $verifyRoleForm;
let $verifyRoleMessageSuccess;
let $verifyRoleMessageSuccessText;
let $verifyRoleMessageDanger;
let $verifyRoleMessageDangerText;

let $addRoleForm;
let $addRoleMessageSuccess;
let $addRoleMessageSuccessText;
let $addRoleMessageDanger;
let $addRoleMessageDangerText;

let $removeRoleForm;
let $removeRoleMessageSuccess;
let $removeRoleMessageSuccessText;
let $removeRoleMessageDanger;
let $removeRoleMessageDangerText;

const registerElements = () => {
    $connectedNetwork = document.getElementById('connectedNetwork');
    $contractAddress = document.getElementById('contractAddressIndex');

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

    $mintToForm = document.getElementById('mintTo');
    $mintToMessageSuccess = document.getElementById('mintTo-result-success');
    $mintToMessageSuccessText = document.getElementById('mintTo-result-success-text');
    $mintToMessageDanger = document.getElementById('mintTo-result-danger');
    $mintToMessageDangerText = document.getElementById('mintTo-result-danger-text');

    $burnFromForm = document.getElementById('burnFrom');
    $burnFromMessageSuccess = document.getElementById('burnFrom-result-success');
    $burnFromMessageSuccessText = document.getElementById('burnFrom-result-success-text');
    $burnFromMessageDanger = document.getElementById('burnFrom-result-danger');
    $burnFromMessageDangerText = document.getElementById('burnFrom-result-danger-text');

    $lifecycleForm = document.getElementById('lifecycle');
    $lifecycleStatus = document.getElementById('lifecycleStatus');
    $lifecycleButtons = document.getElementById('lifecycleButtons');
    $lifecycleStatusInput = document.getElementById('lifecycleStatusInput');
    $lifecycleStatusIndex = document.getElementById('lifecycleStatusIndex');
    $lifecycleStatusIndexDiv = document.getElementById('lifecycleStatusIndexDiv');

    $verifyRoleForm = document.getElementById('verifyRole');
    $verifyRoleMessageSuccess = document.getElementById('verifyRole-result-success');
    $verifyRoleMessageSuccessText = document.getElementById('verifyRole-result-success-text');
    $verifyRoleMessageDanger = document.getElementById('verifyRole-result-danger');
    $verifyRoleMessageDangerText = document.getElementById('verifyRole-result-danger-text');

    $addRoleForm = document.getElementById('addRole');
    $addRoleMessageSuccess = document.getElementById('addRole-result-success');
    $addRoleMessageSuccessText = document.getElementById('addRole-result-success-text');
    $addRoleMessageDanger = document.getElementById('addRole-result-danger');
    $addRoleMessageDangerText = document.getElementById('addRole-result-danger-text');

    $removeRoleForm = document.getElementById('removeRole');
    $removeRoleMessageSuccess = document.getElementById('removeRole-result-success');
    $removeRoleMessageSuccessText = document.getElementById('removeRole-result-success-text');
    $removeRoleMessageDanger = document.getElementById('removeRole-result-danger');
    $removeRoleMessageDangerText = document.getElementById('removeRole-result-danger-text');
};

const init = async () => {
    try {

        //token
        registerTokenElements(
            $tokenName,
            $tokenTotalsupply,
            $tokenSymbol,
            contractInstance
        );
        await setTokenInfo();
        await setTotalSupply();

        //account
        registerConnectedWalletElements(
            $walletAddress,
            $walletBalance,
            $connectedNetwork,
            ethers,
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

        //mintTo
        registerMintToElements(
            $mintToForm,
            $mintToMessageSuccess,
            $mintToMessageSuccessText,
            $mintToMessageDanger,
            $mintToMessageDangerText,
            contractInstance
        );
        clearMintToFormModal();
        await registerMintToFormSubmit();

        //burnFrom
        registerBurnFromElements(
            $burnFromForm,
            $burnFromMessageSuccess,
            $burnFromMessageSuccessText,
            $burnFromMessageDanger,
            $burnFromMessageDangerText,
            contractInstance
        );
        clearBurnFromFormModal();
        await registerBurnFromFormSubmit();

        //verifyRole
        registerVerifyRoleElements(
            $verifyRoleForm,
            $verifyRoleMessageSuccess,
            $verifyRoleMessageSuccessText,
            $verifyRoleMessageDanger,
            $verifyRoleMessageDangerText,
            contractInstance
        );
        clearVerifyRoleFormModal();
        await registerVerifyRoleFormSubmit();

        //addRole
        registerAddRoleElements(
            $addRoleForm,
            $addRoleMessageSuccess,
            $addRoleMessageSuccessText,
            $addRoleMessageDanger,
            $addRoleMessageDangerText,
            contractInstance
        );
        clearAddRoleFormModal();
        await registerAddRoleFormSubmit();

        //removeRole
        registerRemoveRoleElements(
            $removeRoleForm,
            $removeRoleMessageSuccess,
            $removeRoleMessageSuccessText,
            $removeRoleMessageDanger,
            $removeRoleMessageDangerText,
            contractInstance
        );
        clearRemoveRoleFormModal();
        await registerRemoveRoleFormSubmit();

        //lifecycle
        registerLifecycleElements(
            $lifecycleForm,
            $lifecycleStatus,
            $lifecycleButtons,
            $lifecycleStatusInput,
            $lifecycleStatusIndex,
            $lifecycleStatusIndexDiv,
            contractInstance
        );
        await getLifecycleStatus();
        await registerLifecycleFormSubmit();
    } catch (err) {
        console.error(err.message);
    }
};

const mmAccountChanged = async () => {
    console.log('account changed');
    await initDapp();
};

const initDapp = async () => {

    registerElements();

    ethers = await initEthers(mmAccountChanged, $connectedNetwork);
    contractInstance = initEthersContract(ethers, $contractAddress);

    await init();
};

document.addEventListener('DOMContentLoaded', async () => {
    await initDapp();
});

import { connectedAccount, setConnectedWalletBalance } from './account.js';
import { setMessage } from './util.js';

let $decreaseApprovalForm;
let $decreaseApprovalMessageSuccess;
let $decreaseApprovalMessageSuccessText;
let $decreaseApprovalMessageDanger;
let $decreaseApprovalMessageDangerText;

let contractInstance;

export const registerDecreaseApprovalElements = (
    _decreaseApprovalForm,
    _decreaseApprovalMessageSuccess,
    _decreaseApprovalMessageSuccessText,
    _decreaseApprovalMessageDanger,
    _decreaseApprovalMessageDangerText,
    _contractInstance,
) => {
    $decreaseApprovalForm = _decreaseApprovalForm;
    $decreaseApprovalMessageSuccess = _decreaseApprovalMessageSuccess;
    $decreaseApprovalMessageSuccessText = _decreaseApprovalMessageSuccessText;
    $decreaseApprovalMessageDanger = _decreaseApprovalMessageDanger;
    $decreaseApprovalMessageDangerText = _decreaseApprovalMessageDangerText;
    contractInstance = _contractInstance;
};

export const clearDecreaseApprovalFormModal = () => {
    $decreaseApprovalForm.reset();
    $decreaseApprovalMessageSuccess.style.display = 'none';
    $decreaseApprovalMessageSuccessText.innerHTML = '';
    $decreaseApprovalMessageDanger.style.display = 'none';
    $decreaseApprovalMessageDangerText.innerHTML = '';
};

export const registerDecreaseApprovalFormSubmit = async () => {
    $decreaseApprovalForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let message = '';
        let messageType = 'danger';

        const spender = e.target.elements[1].value;
        const value = Number(e.target.elements[2].value);

        try {
            const connectedAccountAddress = await connectedAccount();
            await contractInstance.methods.decreaseApproval(spender, value).send({ from: connectedAccountAddress });
            messageType = 'success';
            message = 'decreaseApproval success';
        } catch (err) {
            message = 'decreaseApproval error: ' + err.message;
        }

        setMessage(
            $decreaseApprovalMessageSuccess,
            $decreaseApprovalMessageSuccessText,
            $decreaseApprovalMessageDanger,
            $decreaseApprovalMessageDangerText,
            messageType,
            message);

        await setConnectedWalletBalance();
    });
};
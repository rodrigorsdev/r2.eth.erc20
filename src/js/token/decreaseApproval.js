import { setMessage } from '../util/message';
import { paused } from '../lifecycle/status';

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
            const pausedResult = await paused();
            if (pausedResult === false) {
                await contractInstance.decreaseApproval(spender, value);
                messageType = 'success';
                message = 'DecreaseApproval success!';
            } else {
                message = 'Contract is paused!';
            }
        } catch (err) {
            message = 'DecreaseApproval error: ' + err.message;
        }

        setMessage(
            $decreaseApprovalMessageSuccess,
            $decreaseApprovalMessageSuccessText,
            $decreaseApprovalMessageDanger,
            $decreaseApprovalMessageDangerText,
            messageType,
            message);
    });
};
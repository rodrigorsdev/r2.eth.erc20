import { setMessage } from '../util/message';
import { paused } from '../lifecycle/status';

let $decreaseApprovalForm;
let $decreaseApprovalMessageSuccess;
let $decreaseApprovalMessageSuccessText;
let $decreaseApprovalMessageDanger;
let $decreaseApprovalMessageDangerText;
let $decreaseApprovalFormSubmitButton;

let contractInstance;

export const registerDecreaseApprovalElements = (
    _decreaseApprovalForm,
    _decreaseApprovalMessageSuccess,
    _decreaseApprovalMessageSuccessText,
    _decreaseApprovalMessageDanger,
    _decreaseApprovalMessageDangerText,
    _decreaseApprovalFormSubmitButton,
    _contractInstance,
) => {
    $decreaseApprovalForm = _decreaseApprovalForm;
    $decreaseApprovalMessageSuccess = _decreaseApprovalMessageSuccess;
    $decreaseApprovalMessageSuccessText = _decreaseApprovalMessageSuccessText;
    $decreaseApprovalMessageDanger = _decreaseApprovalMessageDanger;
    $decreaseApprovalMessageDangerText = _decreaseApprovalMessageDangerText;
    $decreaseApprovalFormSubmitButton = _decreaseApprovalFormSubmitButton;
    contractInstance = _contractInstance;
};

export const clearDecreaseApprovalFormModal = () => {
    $decreaseApprovalForm.reset();
    $decreaseApprovalMessageSuccess.style.display = 'none';
    $decreaseApprovalMessageSuccessText.innerHTML = '';
    $decreaseApprovalMessageDanger.style.display = 'none';
    $decreaseApprovalMessageDangerText.innerHTML = '';
};

var decreaseApprovalFormSubmitted = false;

export const registerDecreaseApprovalFormSubmit = async () => {
    $decreaseApprovalForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        $decreaseApprovalFormSubmitButton.disabled = true;

        if (!decreaseApprovalFormSubmitted) {

            decreaseApprovalFormSubmitted = true;

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
                message = `DecreaseApproval error: ${err.message}`;
            } finally {
                decreaseApprovalFormSubmitted = false;
                $decreaseApprovalFormSubmitButton.disabled = false;
                setMessage(
                    $decreaseApprovalMessageSuccess,
                    $decreaseApprovalMessageSuccessText,
                    $decreaseApprovalMessageDanger,
                    $decreaseApprovalMessageDangerText,
                    messageType,
                    message);
            }
        }
    });
};
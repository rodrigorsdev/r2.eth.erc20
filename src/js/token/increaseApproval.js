import { setMessage } from '../util/message';
import { paused } from '../lifecycle/status';

let $increaseApprovalForm;
let $increaseApprovalMessageSuccess;
let $increaseApprovalMessageSuccessText;
let $increaseApprovalMessageDanger;
let $increaseApprovalMessageDangerText;

let contractInstance;

export const registerIncreaseApprovalElements = (
    _increaseApprovalForm,
    _increaseApprovalMessageSuccess,
    _increaseApprovalMessageSuccessText,
    _increaseApprovalMessageDanger,
    _increaseApprovalMessageDangerText,
    _contractInstance,
) => {
    $increaseApprovalForm = _increaseApprovalForm;
    $increaseApprovalMessageSuccess = _increaseApprovalMessageSuccess;
    $increaseApprovalMessageSuccessText = _increaseApprovalMessageSuccessText;
    $increaseApprovalMessageDanger = _increaseApprovalMessageDanger;
    $increaseApprovalMessageDangerText = _increaseApprovalMessageDangerText;
    contractInstance = _contractInstance;
};

export const clearIncreaseApprovalFormModal = () => {
    $increaseApprovalForm.reset();
    $increaseApprovalMessageSuccess.style.display = 'none';
    $increaseApprovalMessageSuccessText.innerHTML = '';
    $increaseApprovalMessageDanger.style.display = 'none';
    $increaseApprovalMessageDangerText.innerHTML = '';
};

export const registerIncreaseApprovalFormSubmit = async () => {
    $increaseApprovalForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let message = '';
        let messageType = 'danger';

        const spender = e.target.elements[1].value;
        const value = Number(e.target.elements[2].value);

        try {
            const pausedResult = await paused();
            if (pausedResult === false) {
                await contractInstance.increaseApproval(spender, value);
                messageType = 'success';
                message = 'IncreaseApproval success!';
            } else {
                message = 'Contract is paused!';
            }
        } catch (err) {
            message = 'IncreaseApproval error: ' + err.message;
        }

        setMessage(
            $increaseApprovalMessageSuccess,
            $increaseApprovalMessageSuccessText,
            $increaseApprovalMessageDanger,
            $increaseApprovalMessageDangerText,
            messageType,
            message);
    });
};
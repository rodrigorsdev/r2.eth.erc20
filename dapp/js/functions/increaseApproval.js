import { connectedAccount, setConnectedWalletBalance } from './account.js';
import { setMessage } from './util.js';

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
            const connectedAccountAddress = await connectedAccount();
            await contractInstance.methods.increaseApproval(spender, value).send({ from: connectedAccountAddress });
            messageType = 'success';
            message = 'increaseApproval success';
        } catch (err) {
            message = 'increaseApproval error: ' + err.message;
        }

        setMessage(
            $increaseApprovalMessageSuccess,
            $increaseApprovalMessageSuccessText,
            $increaseApprovalMessageDanger,
            $increaseApprovalMessageDangerText,
            messageType,
            message);

        await setConnectedWalletBalance();
    });
};
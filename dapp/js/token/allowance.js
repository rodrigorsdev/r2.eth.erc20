import { connectedAccount } from './account.js';
import { setMessage } from '../util/message.js';

let $allowanceForm;
let $allowanceMessageSuccess;
let $allowanceMessageSuccessText;
let $allowanceMessageDanger;
let $allowanceMessageDangerText;
let contractInstance;

export const registerAllowanceElements = (
    _allowanceForm,
    _allowanceMessageSuccess,
    _allowanceMessageSuccessText,
    _allowanceMessageDanger,
    _allowanceMessageDangerText,
    _contractInstance
) => {
    $allowanceForm = _allowanceForm;
    $allowanceMessageSuccess = _allowanceMessageSuccess;
    $allowanceMessageSuccessText = _allowanceMessageSuccessText;
    $allowanceMessageDanger = _allowanceMessageDanger;
    $allowanceMessageDangerText = _allowanceMessageDangerText;
    contractInstance = _contractInstance;
};

export const clearAllowanceForm = () => {
    $allowanceForm.reset();
    $allowanceMessageSuccess.style.display = 'none';
    $allowanceMessageSuccessText.innerHTML = '';
    $allowanceMessageDanger.style.display = 'none';
    $allowanceMessageDangerText.innerHTML = '';
};

export const allowanceFormSubmit = async () => {
    $allowanceForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        let messageType = 'danger';
        let message = '';
        let allowanceResult = 0;

        try {
            const owner = e.target.elements[0].value;
            const spender = e.target.elements[1].value;

            const connectedAccountAddress = await connectedAccount();
            const allowance = await contractInstance.methods.allowance(owner, spender).send({ from: connectedAccountAddress });

            const allowanceNumber = Number(allowance);

            if (!Number.isNaN(allowanceNumber)) {
                allowanceResult = Number(allowanceNumber);
            }

            messageType = 'success';
            message = 'owner ' + owner + ' spender ' + spender + ' allowance ' + allowanceResult;
        } catch (err) {
            message = 'allowance error: ' + err.message;
        }

        setMessage(
            $allowanceMessageSuccess,
            $allowanceMessageSuccessText,
            $allowanceMessageDanger,
            $allowanceMessageDangerText,
            messageType,
            message);
    });
};
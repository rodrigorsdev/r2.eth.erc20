import { setMessage } from '../util/message';

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
            const owner = e.target.elements[1].value;
            const spender = e.target.elements[2].value;

            const allowance = await contractInstance.allowance(owner, spender);

            const allowanceNumber = Number(allowance);

            if (!Number.isNaN(allowanceNumber)) {
                allowanceResult = Number(allowanceNumber);
            }

            messageType = 'success';
            message = `Allowance: ${allowanceResult}`;
        } catch (err) {
            message = `Allowance error: ${err.message}`;
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
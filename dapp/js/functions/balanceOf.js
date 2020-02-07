import { setMessage } from './util.js';

let $balanceOfForm;
let $balanceOfMessageSuccess;
let $balanceOfMessageSuccessText;
let $balanceOfMessageDanger;
let $balanceOfMessageDangerText;
let contractInstance;

export const registerBalanceOfElements = (
    _balanceOfForm,
    _balanceOfMessageSuccess,
    _balanceOfMessageSuccessText,
    _balanceOfMessageDanger,
    _balanceOfMessageDangerText,
    _contractInstance
) => {
    $balanceOfForm = _balanceOfForm;
    $balanceOfMessageSuccess = _balanceOfMessageSuccess;
    $balanceOfMessageSuccessText = _balanceOfMessageSuccessText;
    $balanceOfMessageDanger = _balanceOfMessageDanger;
    $balanceOfMessageDangerText = _balanceOfMessageDangerText;
    contractInstance = _contractInstance;
};

export const clearBalanceOfForm = () => {
    $balanceOfForm.reset();
    $balanceOfMessageSuccess.style.display = 'none';
    $balanceOfMessageSuccessText.innerHTML = '';
    $balanceOfMessageDanger.style.display = 'none';
    $balanceOfMessageDangerText.innerHTML = '';
};

export const balanceOfFormSubmit = async () => {
    $balanceOfForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        let messageType = 'danger';
        let message = '';

        try {
            const wallet = e.target.elements[0].value;
            const balance = await contractInstance.methods.balanceOf(wallet).call();

            messageType = 'success';
            message = 'balance of ' + wallet + ' is ' + balance;
        } catch (err) {
            message = 'transfer error: ' + err.message;
        }

        setMessage(
            $balanceOfMessageSuccess,
            $balanceOfMessageSuccessText,
            $balanceOfMessageDanger,
            $balanceOfMessageDangerText,
            messageType,
            message);
    });
};
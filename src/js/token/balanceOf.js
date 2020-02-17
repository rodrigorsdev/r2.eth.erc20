import { setMessage } from '../util/message';

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
            const wallet = e.target.elements[1].value;            
            const balance = await contractInstance.balanceOf(wallet);

            messageType = 'success';
            message = `BalanceOf ${wallet}: ${balance}`;
        } catch (err) {
            message = `BalanceOf error: ${err.message}`;
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
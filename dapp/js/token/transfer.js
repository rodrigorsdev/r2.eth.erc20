import { connectedAccount, setConnectedWalletBalance } from './account.js';
import { setMessage } from '../util/message.js';

let $transferForm;
let $transferMessageSuccess;
let $transferMessageSuccessText;
let $transferMessageDanger;
let $transferMessageDangerText;

let contractInstance;

export const registerTranferElements = (
    _transferForm,
    _transferMessageSuccess,
    _transferMessageSuccessText,
    _transferMessageDanger,
    _transferMessageDangerText,
    _contractInstance,
) => {
    $transferForm = _transferForm;
    $transferMessageSuccess = _transferMessageSuccess;
    $transferMessageSuccessText = _transferMessageSuccessText;
    $transferMessageDanger = _transferMessageDanger;
    $transferMessageDangerText = _transferMessageDangerText;
    contractInstance = _contractInstance;
};

export const clearTransferFormModal = () => {
    $transferForm.reset();
    $transferMessageSuccess.style.display = 'none';
    $transferMessageSuccessText.innerHTML = '';
    $transferMessageDanger.style.display = 'none';
    $transferMessageDangerText.innerHTML = '';
};

export const registerTransferFormSubmit = async () => {
    $transferForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let message = '';
        let messageType = 'danger';

        const to = e.target.elements[1].value;
        const value = Number(e.target.elements[2].value);

        try {
            const connectedAccountAddress = await connectedAccount();
            await contractInstance.methods.transfer(to, value).send({ from: connectedAccountAddress });
            messageType = 'success';
            message = 'transfer success';
        } catch (err) {
            message = 'transfer error: ' + err.message;
        }

        setMessage(
            $transferMessageSuccess,
            $transferMessageSuccessText,
            $transferMessageDanger,
            $transferMessageDangerText,
            messageType,
            message);

        await setConnectedWalletBalance();
    });
};
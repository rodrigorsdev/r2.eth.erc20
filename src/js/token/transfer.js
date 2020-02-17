import { setMessage } from '../util/message';
import { setConnectedWalletBalance } from '../token/account';
import { paused } from '../lifecycle/status';

let $transferForm;
let $transferMessageSuccess;
let $transferMessageSuccessText;
let $transferMessageDanger;
let $transferMessageDangerText;
let $transferFormSubmitButton;

let contractInstance;

export const registerTranferElements = (
    _transferForm,
    _transferMessageSuccess,
    _transferMessageSuccessText,
    _transferMessageDanger,
    _transferMessageDangerText,
    _transferFormSubmitButton,
    _contractInstance,
) => {
    $transferForm = _transferForm;
    $transferMessageSuccess = _transferMessageSuccess;
    $transferMessageSuccessText = _transferMessageSuccessText;
    $transferMessageDanger = _transferMessageDanger;
    $transferMessageDangerText = _transferMessageDangerText;
    $transferFormSubmitButton = _transferFormSubmitButton;
    contractInstance = _contractInstance;
};

export const clearTransferFormModal = () => {
    $transferForm.reset();
    $transferMessageSuccess.style.display = 'none';
    $transferMessageSuccessText.innerHTML = '';
    $transferMessageDanger.style.display = 'none';
    $transferMessageDangerText.innerHTML = '';
};

var transferFormSubmitted = false;

export const registerTransferFormSubmit = async () => {
    $transferForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        $transferFormSubmitButton.disabled = true;

        if (!transferFormSubmitted) {

            transferFormSubmitted = true;

            let message = '';
            let messageType = 'danger';

            const to = e.target.elements[1].value;
            const value = Number(e.target.elements[2].value);

            try {
                const pausedResult = await paused();
                if (pausedResult === false) {
                    await contractInstance.transfer(to, value);
                    messageType = 'success';
                    message = 'Transfer success!';
                } else {
                    message = 'Contract is paused!';
                }
            } catch (err) {
                message = `Transfer error: ${err.message}`;
            } finally {
                transferFormSubmitted = false;
                $transferFormSubmitButton.disabled = false;

                setMessage(
                    $transferMessageSuccess,
                    $transferMessageSuccessText,
                    $transferMessageDanger,
                    $transferMessageDangerText,
                    messageType,
                    message);

                await setConnectedWalletBalance();
            }

        } else {
            console.log('transfer form already submited');
        }
    });
};
import { setConnectedWalletBalance } from './account';
import { setMessage } from '../util/message';
import { paused } from '../lifecycle/status';

let $transferFromForm;
let $transferFromMessageSuccess;
let $transferFromMessageSuccessText;
let $transferFromMessageDanger;
let $transferFromMessageDangerText;
let $transferFromFormSubmitButton;

let contractInstance;

export const registerTranferFromElements = (
    _transferFromForm,
    _transferFromMessageSuccess,
    _transferFromMessageSuccessText,
    _transferFromMessageDanger,
    _transferFromMessageDangerText,
    _transferFromFormSubmitButton,
    _contractInstance,
) => {
    $transferFromForm = _transferFromForm;
    $transferFromMessageSuccess = _transferFromMessageSuccess;
    $transferFromMessageSuccessText = _transferFromMessageSuccessText;
    $transferFromMessageDanger = _transferFromMessageDanger;
    $transferFromMessageDangerText = _transferFromMessageDangerText;
    $transferFromFormSubmitButton = _transferFromFormSubmitButton;
    contractInstance = _contractInstance;
};

export const clearTransferFromFormModal = () => {
    $transferFromForm.reset();
    $transferFromMessageSuccess.style.display = 'none';
    $transferFromMessageSuccessText.innerHTML = '';
    $transferFromMessageDanger.style.display = 'none';
    $transferFromMessageDangerText.innerHTML = '';
};

var transferFromFormSubmitted = false;

export const registerTransferFromFormSubmit = async () => {
    $transferFromForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        $transferFromFormSubmitButton.disabled = true;

        if (!transferFromFormSubmitted) {

            transferFromFormSubmitted = true;

            let message = '';
            let messageType = 'danger';

            const from = e.target.elements[1].value;
            const to = e.target.elements[2].value;
            const value = Number(e.target.elements[3].value);

            try {
                const pausedResult = await paused();
                if (pausedResult === false) {
                    await contractInstance.transferFrom(from, to, value);
                    messageType = 'success';
                    message = 'TransferFrom success!';
                } else {
                    message = 'Contract is paused!';
                }
            } catch (err) {
                message = `TransferFrom error: ${err.message}`;
            } finally {
                transferFromFormSubmitted = false;
                $transferFromFormSubmitButton.disabled = false;

                setMessage(
                    $transferFromMessageSuccess,
                    $transferFromMessageSuccessText,
                    $transferFromMessageDanger,
                    $transferFromMessageDangerText,
                    messageType,
                    message);

                await setConnectedWalletBalance();
            }


        } else {
            console.log('transferFrom form already submited');
        }
    });
};
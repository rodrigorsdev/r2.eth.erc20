import { connectedAccount, setConnectedWalletBalance } from './account.js';
import { setMessage } from './util.js';

let $transferFromForm;
let $transferFromMessageSuccess;
let $transferFromMessageSuccessText;
let $transferFromMessageDanger;
let $transferFromMessageDangerText;

let contractInstance;

export const registerTranferFromElements = (
    _transferFromForm,
    _transferFromMessageSuccess,
    _transferFromMessageSuccessText,
    _transferFromMessageDanger,
    _transferFromMessageDangerText,
    _contractInstance,
) => {
    $transferFromForm = _transferFromForm;
    $transferFromMessageSuccess = _transferFromMessageSuccess;
    $transferFromMessageSuccessText = _transferFromMessageSuccessText;
    $transferFromMessageDanger = _transferFromMessageDanger;
    $transferFromMessageDangerText = _transferFromMessageDangerText;
    contractInstance = _contractInstance;
};

export const clearTransferFromFormModal = () => {
    $transferFromForm.reset();
    $transferFromMessageSuccess.style.display = 'none';
    $transferFromMessageSuccessText.innerHTML = '';
    $transferFromMessageDanger.style.display = 'none';
    $transferFromMessageDangerText.innerHTML = '';
};

export const registerTransferFromFormSubmit = async () => {
    $transferFromForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let message = '';
        let messageType = 'danger';

        const from = e.target.elements[1].value;
        const to = e.target.elements[2].value;
        const value = Number(e.target.elements[3].value);

        try {
            const connectedAccountAddress = await connectedAccount();
            await contractInstance.methods.transferFrom(from, to, value).send({ from: connectedAccountAddress });
            messageType = 'success';
            message = 'transfer from success';
        } catch (err) {
            message = 'transfer from error: ' + err.message;
        }

        setMessage(
            $transferFromMessageSuccess,
            $transferFromMessageSuccessText,
            $transferFromMessageDanger,
            $transferFromMessageDangerText,
            messageType,
            message);

        await setConnectedWalletBalance();
    });
};
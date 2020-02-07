import { connectedAccount, setConnectedWalletBalance } from './account.js';
import { setMessage } from './util.js';

let $burnFromForm;
let $burnFromMessageSuccess;
let $burnFromMessageSuccessText;
let $burnFromMessageDanger;
let $burnFromMessageDangerText;

let contractInstance;

export const registerBurnFromElements = (
    _burnFromForm,
    _burnFromMessageSuccess,
    _burnFromMessageSuccessText,
    _burnFromMessageDanger,
    _burnFromMessageDangerText,
    _contractInstance,
) => {
    $burnFromForm = _burnFromForm;
    $burnFromMessageSuccess = _burnFromMessageSuccess;
    $burnFromMessageSuccessText = _burnFromMessageSuccessText;
    $burnFromMessageDanger = _burnFromMessageDanger;
    $burnFromMessageDangerText = _burnFromMessageDangerText;
    contractInstance = _contractInstance;
};

export const clearBurnFromFormModal = () => {
    $burnFromForm.reset();
    $burnFromMessageSuccess.style.display = 'none';
    $burnFromMessageSuccessText.innerHTML = '';
    $burnFromMessageDanger.style.display = 'none';
    $burnFromMessageDangerText.innerHTML = '';
};

export const registerBurnFromFormSubmit = async () => {
    $burnFromForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let message = '';
        let messageType = 'danger';

        const from = e.target.elements[1].value;
        const amount = Number(e.target.elements[2].value);

        try {
            const connectedAccountAddress = await connectedAccount();
            await contractInstance.methods.burnFrom(from, amount).send({ from: connectedAccountAddress });
            messageType = 'success';
            message = 'burnFrom success';
        } catch (err) {
            message = 'burnFrom error: ' + err.message;
        }

        setMessage(
            $burnFromMessageSuccess,
            $burnFromMessageSuccessText,
            $burnFromMessageDanger,
            $burnFromMessageDangerText,
            messageType,
            message);

        await setConnectedWalletBalance();
    });
};
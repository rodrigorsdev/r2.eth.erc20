import { connectedAccount, setConnectedWalletBalance } from './account';
import { setMessage } from '../util/message';

let $mintToForm;
let $mintToMessageSuccess;
let $mintToMessageSuccessText;
let $mintToMessageDanger;
let $mintToMessageDangerText;

let contractInstance;

export const registerMintToElements = (
    _mintToForm,
    _mintToMessageSuccess,
    _mintToMessageSuccessText,
    _mintToMessageDanger,
    _mintToMessageDangerText,
    _contractInstance,
) => {
    $mintToForm = _mintToForm;
    $mintToMessageSuccess = _mintToMessageSuccess;
    $mintToMessageSuccessText = _mintToMessageSuccessText;
    $mintToMessageDanger = _mintToMessageDanger;
    $mintToMessageDangerText = _mintToMessageDangerText;
    contractInstance = _contractInstance;
};

export const clearMintToFormModal = () => {
    $mintToForm.reset();
    $mintToMessageSuccess.style.display = 'none';
    $mintToMessageSuccessText.innerHTML = '';
    $mintToMessageDanger.style.display = 'none';
    $mintToMessageDangerText.innerHTML = '';
};

export const registerMintToFormSubmit = async () => {
    $mintToForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let message = '';
        let messageType = 'danger';

        const to = e.target.elements[1].value;
        const amount = Number(e.target.elements[2].value);

        try {
            const connectedAccountAddress = await connectedAccount();
            await contractInstance.methods.mintTo(to, amount).send({ from: connectedAccountAddress });
            messageType = 'success';
            message = 'mintTo success';
        } catch (err) {
            message = 'mintTo error: ' + err.message;
        }

        setMessage(
            $mintToMessageSuccess,
            $mintToMessageSuccessText,
            $mintToMessageDanger,
            $mintToMessageDangerText,
            messageType,
            message);

        await setConnectedWalletBalance();
    });
};
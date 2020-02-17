import { setConnectedWalletBalance, connectedAccount } from './account';
import { setTotalSupply } from './token';
import { setMessage } from '../util/message';
import { paused } from '../lifecycle/status';
import { isMinter } from '../roles/verifyRole';

let $mintToForm;
let $mintToMessageSuccess;
let $mintToMessageSuccessText;
let $mintToMessageDanger;
let $mintToMessageDangerText;
let $mintToSubmitButton;

let contractInstance;

export const registerMintToElements = (
    _mintToForm,
    _mintToMessageSuccess,
    _mintToMessageSuccessText,
    _mintToMessageDanger,
    _mintToMessageDangerText,
    _mintToSubmitButton,
    _contractInstance,
) => {
    $mintToForm = _mintToForm;
    $mintToMessageSuccess = _mintToMessageSuccess;
    $mintToMessageSuccessText = _mintToMessageSuccessText;
    $mintToMessageDanger = _mintToMessageDanger;
    $mintToMessageDangerText = _mintToMessageDangerText;
    $mintToSubmitButton = _mintToSubmitButton;
    contractInstance = _contractInstance;
};

export const clearMintToFormModal = () => {
    $mintToForm.reset();
    $mintToMessageSuccess.style.display = 'none';
    $mintToMessageSuccessText.innerHTML = '';
    $mintToMessageDanger.style.display = 'none';
    $mintToMessageDangerText.innerHTML = '';
};

let mintToFormSubmitted = false;

export const registerMintToFormSubmit = async () => {
    $mintToForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        $mintToSubmitButton.disabled = true;

        if (!mintToFormSubmitted) {

            mintToFormSubmitted = true;

            let message = '';
            let messageType = 'danger';

            const to = e.target.elements[1].value;
            const amount = Number(e.target.elements[2].value);

            try {
                const pausedResult = await paused();
                if (pausedResult === false) {

                    const connectedAccountResult = await connectedAccount();
                    const isMinterResult = await isMinter(connectedAccountResult);

                    if (isMinterResult) {
                        await contractInstance.mintTo(to, amount);
                        messageType = 'success';
                        message = 'MintTo success';
                    } else {
                        message = 'You do not have an Minter Role defined!';
                    }
                } else {
                    message = 'Contract is paused!';
                }
            } catch (err) {
                message = `MintTo error: ${err.message}`;
            } finally {
                mintToFormSubmitted = false;
                $mintToSubmitButton.disabled = false;
                
                setMessage(
                    $mintToMessageSuccess,
                    $mintToMessageSuccessText,
                    $mintToMessageDanger,
                    $mintToMessageDangerText,
                    messageType,
                    message);

                await setTotalSupply();

                await setConnectedWalletBalance();
            }
        }
    });
};
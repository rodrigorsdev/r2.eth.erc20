import { setConnectedWalletBalance, connectedAccount } from './account';
import { setTotalSupply } from './token';
import { setMessage } from '../util/message';
import { paused } from '../lifecycle/status';
import { isBurner } from '../roles/verifyRole';

let $burnFromForm;
let $burnFromMessageSuccess;
let $burnFromMessageSuccessText;
let $burnFromMessageDanger;
let $burnFromMessageDangerText;
let $burnFromSubmitButton;

let contractInstance;

export const registerBurnFromElements = (
    _burnFromForm,
    _burnFromMessageSuccess,
    _burnFromMessageSuccessText,
    _burnFromMessageDanger,
    _burnFromMessageDangerText,
    _burnFromSubmitButton,
    _contractInstance,
) => {
    $burnFromForm = _burnFromForm;
    $burnFromMessageSuccess = _burnFromMessageSuccess;
    $burnFromMessageSuccessText = _burnFromMessageSuccessText;
    $burnFromMessageDanger = _burnFromMessageDanger;
    $burnFromMessageDangerText = _burnFromMessageDangerText;
    $burnFromSubmitButton = _burnFromSubmitButton;
    contractInstance = _contractInstance;
};

export const clearBurnFromFormModal = () => {
    $burnFromForm.reset();
    $burnFromMessageSuccess.style.display = 'none';
    $burnFromMessageSuccessText.innerHTML = '';
    $burnFromMessageDanger.style.display = 'none';
    $burnFromMessageDangerText.innerHTML = '';
};

let burnFromFormSubmitted = false;

export const registerBurnFromFormSubmit = async () => {
    $burnFromForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        $burnFromSubmitButton.disabled = true;

        if (!burnFromFormSubmitted) {

            burnFromFormSubmitted = true;

            let message = '';
            let messageType = 'danger';

            const from = e.target.elements[1].value;
            const amount = Number(e.target.elements[2].value);

            try {
                const pausedResult = await paused();
                if (pausedResult === false) {

                    const connectedAccountResult = await connectedAccount();
                    const isBurnerResult = await isBurner(connectedAccountResult);

                    if (isBurnerResult) {
                        await contractInstance.burnFrom(from, amount);
                        messageType = 'success';
                        message = 'BurnFrom success!';
                    } else {
                        message = 'You do not have an Burner Role defined!';
                    }
                } else {
                    message = 'Contract is paused!';
                }
            } catch (err) {
                message = `BurnFrom error: ${err.message}`;
            } finally {
                burnFromFormSubmitted = false;
                $burnFromSubmitButton.disabled = false;
                
                setMessage(
                    $burnFromMessageSuccess,
                    $burnFromMessageSuccessText,
                    $burnFromMessageDanger,
                    $burnFromMessageDangerText,
                    messageType,
                    message);

                await setTotalSupply();

                await setConnectedWalletBalance();
            }
        }
    });
};
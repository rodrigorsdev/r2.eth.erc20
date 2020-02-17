import { setConnectedWalletBalance } from './account';
import { setMessage } from '../util/message';
import { paused } from '../lifecycle/status';

let $approveForm;
let $approveMessageSuccess;
let $approveMessageSuccessText;
let $approveMessageDanger;
let $approveMessageDangerText;
let $approveFormSubmitButton;

let contractInstance;

export const registerApproveElements = (
    _approveForm,
    _approveMessageSuccess,
    _approveMessageSuccessText,
    _approveMessageDanger,
    _approveMessageDangerText,
    _approveFormSubmitButton,
    _contractInstance,
) => {
    $approveForm = _approveForm;
    $approveMessageSuccess = _approveMessageSuccess;
    $approveMessageSuccessText = _approveMessageSuccessText;
    $approveMessageDanger = _approveMessageDanger;
    $approveMessageDangerText = _approveMessageDangerText;
    $approveFormSubmitButton = _approveFormSubmitButton;
    contractInstance = _contractInstance;
};

export const clearApproveFormModal = () => {
    $approveForm.reset();
    $approveMessageSuccess.style.display = 'none';
    $approveMessageSuccessText.innerHTML = '';
    $approveMessageDanger.style.display = 'none';
    $approveMessageDangerText.innerHTML = '';
};

var approveFormSubmitted = false;

export const registerApproveFormSubmit = async () => {
    $approveForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        $approveFormSubmitButton.disabled = true;

        if (!approveFormSubmitted) {

            approveFormSubmitted = true;

            let message = '';
            let messageType = 'danger';

            const spender = e.target.elements[1].value;
            const value = Number(e.target.elements[2].value);

            try {
                const pausedResult = await paused();
                if (pausedResult === false) {
                    await contractInstance.approve(spender, value);
                    messageType = 'success';
                    message = 'Approve success!';
                } else {
                    message = 'Contract is paused!';
                }
            } catch (err) {
                message = `Approve error: ${err.message}`;
            } finally {
                approveFormSubmitted = false;
                $approveFormSubmitButton.disabled = false;

                setMessage(
                    $approveMessageSuccess,
                    $approveMessageSuccessText,
                    $approveMessageDanger,
                    $approveMessageDangerText,
                    messageType,
                    message);

                await setConnectedWalletBalance();
            }
        }
    });
};
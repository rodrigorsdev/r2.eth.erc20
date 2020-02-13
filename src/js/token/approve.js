import { setConnectedWalletBalance } from './account';
import { setMessage } from '../util/message';
import { paused } from '../lifecycle/status';

let $approveForm;
let $approveMessageSuccess;
let $approveMessageSuccessText;
let $approveMessageDanger;
let $approveMessageDangerText;

let contractInstance;

export const registerApproveElements = (
    _approveForm,
    _approveMessageSuccess,
    _approveMessageSuccessText,
    _approveMessageDanger,
    _approveMessageDangerText,
    _contractInstance,
) => {
    $approveForm = _approveForm;
    $approveMessageSuccess = _approveMessageSuccess;
    $approveMessageSuccessText = _approveMessageSuccessText;
    $approveMessageDanger = _approveMessageDanger;
    $approveMessageDangerText = _approveMessageDangerText;
    contractInstance = _contractInstance;
};

export const clearApproveFormModal = () => {
    $approveForm.reset();
    $approveMessageSuccess.style.display = 'none';
    $approveMessageSuccessText.innerHTML = '';
    $approveMessageDanger.style.display = 'none';
    $approveMessageDangerText.innerHTML = '';
};

export const registerApproveFormSubmit = async () => {
    $approveForm.addEventListener('submit', async (e) => {
        e.preventDefault();

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
        }

        setMessage(
            $approveMessageSuccess,
            $approveMessageSuccessText,
            $approveMessageDanger,
            $approveMessageDangerText,
            messageType,
            message);

        await setConnectedWalletBalance();
    });
};
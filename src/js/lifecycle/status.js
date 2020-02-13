import { isAdmin } from '../roles/verifyRole';
import { setMessage } from '../util/message';
import { connectedAccount } from '../token/account';

let $lifecycleForm;
let $lifecycleStatus;
let $lifecycleButtons;
let $lifecycleStatusInput;
let $lifecycleStatusIndex;
let $lifecycleStatusIndexDiv;
let $lifecycleMessageDanger;
let $lifecycleMessageDangerText;

let contractInstance;

export const registerLifecycleElements = (
    _lifecycleForm,
    _lifecycleStatus,
    _lifecycleButtons,
    _lifecycleStatusInput,
    _lifecycleStatusIndex,
    _lifecycleStatusIndexDiv,
    _lifecycleMessageDanger,
    _lifecycleMessageDangerText,
    _contractInstance
) => {
    $lifecycleForm = _lifecycleForm;
    $lifecycleStatus = _lifecycleStatus;
    $lifecycleButtons = _lifecycleButtons;
    $lifecycleStatusInput = _lifecycleStatusInput;
    $lifecycleStatusIndex = _lifecycleStatusIndex;
    $lifecycleStatusIndexDiv = _lifecycleStatusIndexDiv;
    $lifecycleMessageDanger = _lifecycleMessageDanger;
    $lifecycleMessageDangerText = _lifecycleMessageDangerText;
    contractInstance = _contractInstance;
};

export const clearLifecycleModal = () => {
    $lifecycleMessageDanger.style.display = 'none';
    $lifecycleMessageDangerText.innerHTML = '';
};

export const getLifecycleStatus = async () => {
    let status = 'Paused';
    let alertDanger = 'border-left-danger';
    let alertSuccess = 'border-left-success';
    let alert = alertDanger;

    $lifecycleStatusIndexDiv.classList.remove(alertDanger);
    $lifecycleStatusIndexDiv.classList.remove(alertSuccess);

    const result = await contractInstance.paused();

    if (result === false) {
        status = 'Running';
        alert = alertSuccess;
    }

    $lifecycleStatusInput.value = status;
    $lifecycleStatus.innerHTML = status;
    $lifecycleStatusIndex.innerHTML = ' ' + status;
    $lifecycleStatusIndexDiv.classList.add(alert);

    setStatusButton();
};

const setStatusButton = () => {
    let button = document.createElement('input');
    button.type = 'submit';
    button.classList.add('btn');

    if ($lifecycleStatusInput.value === 'Running') {
        //set pause button
        button.value = 'Pause';
        button.classList.add('btn-danger');
    } else if ($lifecycleStatusInput.value === 'Paused') {
        //set run button
        button.value = 'Run';
        button.classList.add('btn-primary');
    }

    $lifecycleButtons.appendChild(button);
};

export const registerLifecycleFormSubmit = async () => {
    $lifecycleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const status = e.target.elements[1].value;

        try {
            const connectedAccountResult = await connectedAccount();
            const isAdminResult = await isAdmin(connectedAccountResult);

            if (isAdminResult) {
                if (status === 'Paused') {
                    await contractInstance.unpause();
                } else if (status === 'Running') {
                    await contractInstance.pause();
                }
            } else {
                setMessage(
                    null,
                    null,
                    $lifecycleMessageDanger,
                    $lifecycleMessageDangerText,
                    'danger',
                    'You do not have an Admin Role defined!'
                );
            }
        } catch (err) {
            console.error(`Lifecycle error: ${err.message}`);
        }

        $lifecycleButtons.innerHTML = '';

        await getLifecycleStatus();
    });
};

export const paused = async () => {
    return await contractInstance.paused();
};
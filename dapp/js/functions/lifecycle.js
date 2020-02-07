import { connectedAccount } from './account.js';
import { setMessage } from './util.js';

let $lifecycleForm;
let $lifecycleStatus;
let $lifecycleButtons;
let $lifecycleStatusInput;
let $lifecycleMessageSuccess;
let $lifecycleMessageSuccessText;
let $lifecycleMessageDanger;
let $lifecycleMessageDangerText;
let contractInstance;

export const registerLifecycleElements = (
    _lifecycleForm,
    _lifecycleStatus,
    _lifecycleButtons,
    _lifecycleStatusInput,
    _lifecycleMessageSuccess,
    _lifecycleMessageSuccessText,
    _lifecycleMessageDanger,
    _lifecycleMessageDangerText,
    _contractInstance
) => {
    $lifecycleForm = _lifecycleForm;
    $lifecycleStatus = _lifecycleStatus;
    $lifecycleButtons = _lifecycleButtons;
    $lifecycleStatusInput = _lifecycleStatusInput;
    $lifecycleMessageSuccess = _lifecycleMessageSuccess;
    $lifecycleMessageSuccessText = _lifecycleMessageSuccessText;
    $lifecycleMessageDanger = _lifecycleMessageDanger;
    $lifecycleMessageDangerText = _lifecycleMessageDangerText;
    contractInstance = _contractInstance;
};

export const clearLifecycleFormModal = () => {
    $lifecycleForm.reset();
    $lifecycleMessageSuccess.style.display = 'none';
    $lifecycleMessageSuccessText.innerHTML = '';
    $lifecycleMessageDanger.style.display = 'none';
    $lifecycleMessageDangerText.innerHTML = '';
};

export const getLifeciclyStatus = async () => {
    let status = 'paused';

    const result = await contractInstance.methods.paused().call();
    if (!result) {
        status = 'running';
    }

    $lifecycleStatusInput.value = status;
    $lifecycleStatus.innerHTML = status;

    setStatusButton();
};

const setStatusButton = () => {
    let button = document.createElement('input');
    button.type = 'submit';
    button.classList.add('btn');

    if ($lifecycleStatusInput.value === 'running') {
        //set pause button
        button.value = 'Pause';
        button.classList.add('btn-danger');
    } else if ($lifecycleStatusInput.value === 'paused') {
        //set run button
        button.value = 'Run';
        button.classList.add('btn-primary');
    }

    $lifecycleButtons.appendChild(button);
};

export const registerLifecycleFormSubmit = async () => {
    $lifecycleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        console.log('submit');

        let message = '';
        let messageType = 'danger';

        const status = e.target.elements[1].value;

        console.log(status);


        try {
            const connectedAccountAddress = await connectedAccount();

            if (status === 'paused') {
                await contractInstance.methods.unpause().send({ from: connectedAccountAddress });
                messageType = 'success';
                message = 'contract is running';
            } else if (status === 'running') {
                await contractInstance.methods.pause().send({ from: connectedAccountAddress });
                messageType = 'success';
                message = 'contract is paused';
            }
        } catch (err) {
            message = 'lifecycle error: ' + err.message;
        }

        $lifecycleButtons.innerHTML = '';

        await getLifeciclyStatus();

        setMessage(
            $lifecycleMessageSuccess,
            $lifecycleMessageSuccessText,
            $lifecycleMessageDanger,
            $lifecycleMessageDangerText,
            messageType,
            message);
    });
};
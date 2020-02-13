let $lifecycleForm;
let $lifecycleStatus;
let $lifecycleButtons;
let $lifecycleStatusInput;
let $lifecycleStatusIndex;
let $lifecycleStatusIndexDiv;

let contractInstance;

export const registerLifecycleElements = (
    _lifecycleForm,
    _lifecycleStatus,
    _lifecycleButtons,
    _lifecycleStatusInput,
    _lifecycleStatusIndex,
    _lifecycleStatusIndexDiv,
    _contractInstance
) => {
    $lifecycleForm = _lifecycleForm;
    $lifecycleStatus = _lifecycleStatus;
    $lifecycleButtons = _lifecycleButtons;
    $lifecycleStatusInput = _lifecycleStatusInput;
    $lifecycleStatusIndex = _lifecycleStatusIndex;
    $lifecycleStatusIndexDiv = _lifecycleStatusIndexDiv;
    contractInstance = _contractInstance;
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

            if (status === 'Paused') {
                await contractInstance.unpause();
            } else if (status === 'Running') {
                await contractInstance.pause();
            }
        } catch (err) {
            console.error('lifecycle error: ' + err.message);
        }

        $lifecycleButtons.innerHTML = '';

        await getLifecycleStatus();
    });
};
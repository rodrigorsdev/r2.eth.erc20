let $transferForm;
let $transferSubmit;
let $transferMessageSuccess;
let $transferMessageSuccessText;
let $transferMessageDanger;
let $transferMessageDangerText;

let contractInstance;
let connectedAccount;

export const registerTransferForm = async (
    _transferForm,
    _transferSubmit,
    _transferMessageSuccess,
    _transferMessageSuccessText,
    _transferMessageDanger,
    _transferMessageDangerText,
    _contractInstance,
    _connectedAccount
) => {
    $transferForm = _transferForm;
    $transferSubmit = _transferSubmit;
    $transferMessageSuccess = _transferMessageSuccess;
    $transferMessageSuccessText = _transferMessageSuccessText;
    $transferMessageDanger = _transferMessageDanger;
    $transferMessageDangerText = _transferMessageDangerText;
    contractInstance = _contractInstance;
    connectedAccount = _connectedAccount;

    $transferForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        console.log('transfer submited');

        let message = '';
        let messageType = 'danger';

        const to = e.target.elements[1].value;
        const value = Number(e.target.elements[2].value);

        console.log(to);
        console.log(value);

        try {
            await contractInstance.methods.transfer(to, value).send({ from: connectedAccount });
            messageType = 'success';
            message = 'transfer success';
        } catch (err) {
            message = 'transfer error: ' + err.message;
        }

        setTransferModalMessage(
            messageType,
            message);

        //TO DO atualizar balance
    });
};

export const clearTransferModal = () => {
    $transferForm.reset();
    $transferMessageSuccess.style.display = 'none';
    $transferMessageSuccessText.innerHTML = '';
    $transferMessageDanger.style.display = 'none';
    $transferMessageDangerText.innerHTML = '';
};

const setTransferModalMessage = (
    type,
    message
) => {
    if (type === 'success') {
        $transferMessageSuccess.style.display = '';
        $transferMessageSuccessText.innerHTML = message;

        $transferMessageDanger.style.display = 'none';
        $transferMessageDangerText.innerHTML = '';
    } else if (type === 'danger') {
        $transferMessageDanger.style.display = '';
        $transferMessageDangerText.innerHTML = message;

        $transferMessageSuccess.style.display = 'none';
        $transferMessageSuccessText.innerHTML = '';
    }
};
import { setMessage } from '../util/message';
import { connectedAccount } from '../token/account';

let $removeRoleForm;
let $removeRoleMessageSuccess;
let $removeRoleMessageSuccessText;
let $removeRoleMessageDanger;
let $removeRoleMessageDangerText;

let contractInstance;

export const registerRemoveRoleElements = (
    _removeRoleForm,
    _removeRoleMessageSuccess,
    _removeRoleMessageSuccessText,
    _removeRoleMessageDanger,
    _removeRoleMessageDangerText,
    _contractInstance,
) => {
    $removeRoleForm = _removeRoleForm;
    $removeRoleMessageSuccess = _removeRoleMessageSuccess;
    $removeRoleMessageSuccessText = _removeRoleMessageSuccessText;
    $removeRoleMessageDanger = _removeRoleMessageDanger;
    $removeRoleMessageDangerText = _removeRoleMessageDangerText;
    contractInstance = _contractInstance;
};

export const clearRemoveRoleFormModal = () => {
    $removeRoleForm.reset();
    $removeRoleMessageSuccess.style.display = 'none';
    $removeRoleMessageSuccessText.innerHTML = '';
    $removeRoleMessageDanger.style.display = 'none';
    $removeRoleMessageDangerText.innerHTML = '';
};

export const registerRemoveRoleFormSubmit = async () => {
    $removeRoleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let message = '';
        let messageType = 'danger';

        const role = e.target.elements[1].value;
        const address = e.target.elements[2].value;

        try {
            const connectedAccountAddress = await connectedAccount();

            if (role === 'admin') {
                await contractInstance.methods.removeAdmin(address).send({ from: connectedAccountAddress });
                message = address + ' removed from admin';
            } else if (role === 'burner') {
                await contractInstance.methods.removeBurner(address).send({ from: connectedAccountAddress });
                message = address + ' removed from burner';
            } else if (role === 'minter') {
                await contractInstance.methods.removeMinter(address).send({ from: connectedAccountAddress });
                message = address + ' removed from minter';;
            }

            messageType = 'success';

        } catch (err) {
            message = 'removeRole error: ' + err.message;
        }

        setMessage(
            $removeRoleMessageSuccess,
            $removeRoleMessageSuccessText,
            $removeRoleMessageDanger,
            $removeRoleMessageDangerText,
            messageType,
            message);
    });
};
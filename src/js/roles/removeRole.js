import { setMessage } from '../util/message';
import { connectedAccount } from '../token/account';
import { isAdmin } from '../roles/verifyRole';

let $removeRoleForm;
let $removeRoleMessageSuccess;
let $removeRoleMessageSuccessText;
let $removeRoleMessageDanger;
let $removeRoleMessageDangerText;
let $removeRoleSubmitButton;

let contractInstance;

export const registerRemoveRoleElements = (
    _removeRoleForm,
    _removeRoleMessageSuccess,
    _removeRoleMessageSuccessText,
    _removeRoleMessageDanger,
    _removeRoleMessageDangerText,
    _removeRoleSubmitButton,
    _contractInstance,
) => {
    $removeRoleForm = _removeRoleForm;
    $removeRoleMessageSuccess = _removeRoleMessageSuccess;
    $removeRoleMessageSuccessText = _removeRoleMessageSuccessText;
    $removeRoleMessageDanger = _removeRoleMessageDanger;
    $removeRoleMessageDangerText = _removeRoleMessageDangerText;
    $removeRoleSubmitButton = _removeRoleSubmitButton;
    contractInstance = _contractInstance;
};

export const clearRemoveRoleFormModal = () => {
    $removeRoleForm.reset();
    $removeRoleMessageSuccess.style.display = 'none';
    $removeRoleMessageSuccessText.innerHTML = '';
    $removeRoleMessageDanger.style.display = 'none';
    $removeRoleMessageDangerText.innerHTML = '';
};

let removeRoleFormSubmitted = false;

export const registerRemoveRoleFormSubmit = async () => {
    $removeRoleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        $removeRoleSubmitButton.disabled = true;

        if (!removeRoleFormSubmitted) {

            removeRoleFormSubmitted = true;

            let message = '';
            let messageType = 'danger';

            const role = e.target.elements[1].value;
            const address = e.target.elements[2].value;

            try {
                const connectedAccountResult = await connectedAccount();
                const isAdminResult = await isAdmin(connectedAccountResult);

                if (isAdminResult) {
                    if (role === 'admin') {
                        await contractInstance.removeAdmin(address);
                        message = `${address} removed from admin`;
                    } else if (role === 'burner') {
                        await contractInstance.removeBurner(address);
                        message = `${address} removed from burner`;
                    } else if (role === 'minter') {
                        await contractInstance.removeMinter(address);
                        message = `${address} removed from minter`;
                    }

                    messageType = 'success';
                } else {
                    message = 'You do not have an Admin Role defined!';
                }

            } catch (err) {
                message = `RemoveRole error: ${err.message}`;
            } finally {
                removeRoleFormSubmitted = false;
                $removeRoleSubmitButton.disabled = false;

                setMessage(
                    $removeRoleMessageSuccess,
                    $removeRoleMessageSuccessText,
                    $removeRoleMessageDanger,
                    $removeRoleMessageDangerText,
                    messageType,
                    message);
            }
        }
    });
};
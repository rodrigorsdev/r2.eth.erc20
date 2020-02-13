import { setMessage } from '../util/message';
import { connectedAccount } from '../token/account';
import { isAdmin } from '../roles/verifyRole';

let $addRoleForm;
let $addRoleMessageSuccess;
let $addRoleMessageSuccessText;
let $addRoleMessageDanger;
let $addRoleMessageDangerText;

let contractInstance;

export const registerAddRoleElements = (
    _addRoleForm,
    _addRoleMessageSuccess,
    _addRoleMessageSuccessText,
    _addRoleMessageDanger,
    _addRoleMessageDangerText,
    _contractInstance,
) => {
    $addRoleForm = _addRoleForm;
    $addRoleMessageSuccess = _addRoleMessageSuccess;
    $addRoleMessageSuccessText = _addRoleMessageSuccessText;
    $addRoleMessageDanger = _addRoleMessageDanger;
    $addRoleMessageDangerText = _addRoleMessageDangerText;
    contractInstance = _contractInstance;
};

export const clearAddRoleFormModal = () => {
    $addRoleForm.reset();
    $addRoleMessageSuccess.style.display = 'none';
    $addRoleMessageSuccessText.innerHTML = '';
    $addRoleMessageDanger.style.display = 'none';
    $addRoleMessageDangerText.innerHTML = '';
};

export const registerAddRoleFormSubmit = async () => {
    $addRoleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let message = '';
        let messageType = 'danger';

        const role = e.target.elements[1].value;
        const address = e.target.elements[2].value;

        try {
            const connectedAccountResult = await connectedAccount();
            const isAdminResult = await isAdmin(connectedAccountResult);

            if (isAdminResult) {
                if (role === 'admin') {
                    await contractInstance.addAdmin(address);
                    message = `${address} added from admin`;
                } else if (role === 'burner') {
                    await contractInstance.addBurner(address);
                    message = `${address} added from burner`;
                } else if (role === 'minter') {
                    await contractInstance.addMinter(address);
                    message = `${address} added from minter`;;
                }

                messageType = 'success';
            } else {
                message = 'You do not have an Admin Role defined!';
            }

        } catch (err) {
            message = `$AddRole error: ${err.message}`;
        }

        setMessage(
            $addRoleMessageSuccess,
            $addRoleMessageSuccessText,
            $addRoleMessageDanger,
            $addRoleMessageDangerText,
            messageType,
            message);
    });
};
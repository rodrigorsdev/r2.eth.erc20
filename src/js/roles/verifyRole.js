import { setMessage } from '../util/message';

let $verifyRoleForm;
let $verifyRoleMessageSuccess;
let $verifyRoleMessageSuccessText;
let $verifyRoleMessageDanger;
let $verifyRoleMessageDangerText;

let contractInstance;

export const registerVerifyRoleElements = (
    _verifyRoleForm,
    _verifyRoleMessageSuccess,
    _verifyRoleMessageSuccessText,
    _verifyRoleMessageDanger,
    _verifyRoleMessageDangerText,
    _contractInstance,
) => {
    $verifyRoleForm = _verifyRoleForm;
    $verifyRoleMessageSuccess = _verifyRoleMessageSuccess;
    $verifyRoleMessageSuccessText = _verifyRoleMessageSuccessText;
    $verifyRoleMessageDanger = _verifyRoleMessageDanger;
    $verifyRoleMessageDangerText = _verifyRoleMessageDangerText;
    contractInstance = _contractInstance;
};

export const clearVerifyRoleFormModal = () => {
    $verifyRoleForm.reset();
    $verifyRoleMessageSuccess.style.display = 'none';
    $verifyRoleMessageSuccessText.innerHTML = '';
    $verifyRoleMessageDanger.style.display = 'none';
    $verifyRoleMessageDangerText.innerHTML = '';
};

export const registerVerifyRoleFormSubmit = async () => {
    $verifyRoleForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let result = false;
        let message = '';
        let messageType = 'danger';

        const role = e.target.elements[1].value;
        const address = e.target.elements[2].value;

        try {
            if (role === 'admin') {
                result = await contractInstance.isAdmin(address);
                message = 'is admin: ' + result;
            } else if (role === 'burner') {
                result = await contractInstance.isBurner(address);
                message = 'is burner: ' + result;
            } else if (role === 'minter') {
                result = await contractInstance.isMinter(address);
                message = 'is minter: ' + result;
            }

            messageType = 'success';

        } catch (err) {
            message = 'verifyRole error: ' + err.message;
        }

        setMessage(
            $verifyRoleMessageSuccess,
            $verifyRoleMessageSuccessText,
            $verifyRoleMessageDanger,
            $verifyRoleMessageDangerText,
            messageType,
            message);
    });
};

export const isAdmin = async (address) => {
    return await contractInstance.isAdmin(address);
};

export const isMinter = async (address) => {
    return await contractInstance.isMinter(address);
};

export const isBurner = async (address) => {
    return await contractInstance.isBurner(address);
};
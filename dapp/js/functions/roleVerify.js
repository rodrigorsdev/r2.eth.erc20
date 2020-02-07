import { setMessage } from './util.js';

let $roleVerifyForm;
let $roleVerifyMessageSuccess;
let $roleVerifyMessageSuccessText;
let $roleVerifyMessageDanger;
let $roleVerifyMessageDangerText;

let contractInstance;

export const registerRoleVerifyElements = (
    _roleVerifyForm,
    _roleVerifyMessageSuccess,
    _roleVerifyMessageSuccessText,
    _roleVerifyMessageDanger,
    _roleVerifyMessageDangerText,
    _contractInstance,
) => {
    $roleVerifyForm = _roleVerifyForm;
    $roleVerifyMessageSuccess = _roleVerifyMessageSuccess;
    $roleVerifyMessageSuccessText = _roleVerifyMessageSuccessText;
    $roleVerifyMessageDanger = _roleVerifyMessageDanger;
    $roleVerifyMessageDangerText = _roleVerifyMessageDangerText;
    contractInstance = _contractInstance;
};

export const clearRoleVerifyFormModal = () => {
    $roleVerifyForm.reset();
    $roleVerifyMessageSuccess.style.display = 'none';
    $roleVerifyMessageSuccessText.innerHTML = '';
    $roleVerifyMessageDanger.style.display = 'none';
    $roleVerifyMessageDangerText.innerHTML = '';
};

export const registerRoleVerifyFormSubmit = async () => {
    $roleVerifyForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let result = false;
        let message = '';
        let messageType = 'danger';

        const role = e.target.elements[1].value;
        const address = e.target.elements[2].value;

        try {
            if (role === 'admin') {
                result = await contractInstance.methods.isAdmin(address).call();
                message = 'is admin: ' + result;
            } else if (role === 'burner') {
                result = await contractInstance.methods.isBurner(address).call();
                message = 'is burner: ' + result;
            } else if (role === 'minter') {
                result = await contractInstance.methods.isMinter(address).call();
                message = 'is minter: ' + result;
            }

            messageType = 'success';
            
        } catch (err) {
            message = 'roleVerify error: ' + err.message;
        }

        setMessage(
            $roleVerifyMessageSuccess,
            $roleVerifyMessageSuccessText,
            $roleVerifyMessageDanger,
            $roleVerifyMessageDangerText,
            messageType,
            message);
    });
};
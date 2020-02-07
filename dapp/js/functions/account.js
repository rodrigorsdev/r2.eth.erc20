let $walletAddress;
let $walletBalance;
let web3;
let contractInstance;

export const registerConnectedWalletElements = (
    _walletAddress,
    _walletBalance,
    _web3,
    _contractInstance
) => {
    $walletAddress = _walletAddress;
    $walletBalance = _walletBalance;
    web3 = _web3;
    contractInstance = _contractInstance;
};

export const setConnectedWallet = async () => {
    const connectedAccountAddress = await connectedAccount();
    $walletAddress.innerHTML = connectedAccountAddress;
};

export const connectedAccount = async () => {
    let accounts = [];
    accounts = await web3.eth.getAccounts();
    return accounts[0];
};

export const setConnectedWalletBalance = async() => {
    const connectedAccountAddress = await connectedAccount();
    const walletBalance = await contractInstance.methods.balanceOf(connectedAccountAddress).call();
    const tokenSymbol = await contractInstance.methods.symbol().call();
    $walletBalance.innerHTML = walletBalance + ' ' + tokenSymbol;
};
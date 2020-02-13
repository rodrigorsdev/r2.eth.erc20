let $walletAddress;
let $walletBalance;
let $connectedNetwork;
let ethers;
let contractInstance;

export const registerConnectedWalletElements = (
    _walletAddress,
    _walletBalance,
    _connectedNetwork,
    _ethers,
    _contractInstance
) => {
    $walletAddress = _walletAddress;
    $walletBalance = _walletBalance;
    $connectedNetwork = _connectedNetwork;
    ethers = _ethers;
    contractInstance = _contractInstance;
};

export const setConnectedWallet = async () => {
    const connectedAccountAddress = await connectedAccount();
    $walletAddress.innerHTML = connectedAccountAddress;
};

export const connectedAccount = async () => {
    const account = await ethers.getSigner();
    setConnectedNetwork(account);
    return account.provider._web3Provider.selectedAddress;
};

export const setConnectedWalletBalance = async () => {
    const connectedAccountAddress = await connectedAccount();
    const walletBalance = await contractInstance.balanceOf(connectedAccountAddress);
    const tokenSymbol = await contractInstance.symbol();
    $walletBalance.innerHTML = `${walletBalance} ${tokenSymbol}`;
};

const setConnectedNetwork = (account) => {
    let networkDescription;
    const networkId = account.provider._web3Provider.networkVersion;
    switch (networkId) {
        case '1':
            networkDescription = 'Mainnet';
            break;
        case '3':
            networkDescription = 'Ropsten';
            break;
        case '4':
            networkDescription = 'Rinkeby';
            break;
        case '42':
            networkDescription = 'Kovan';
            break;
        default:
            networkDescription = 'Develop';
            break;
    }
    $connectedNetwork.innerHTML = ` ${networkDescription}`;
};
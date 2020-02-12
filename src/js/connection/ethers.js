var ethers = require('ethers');

export const initEthers = async (callbackAccountChanged) => {
    let provider;

    if (window.ethereum) {
        console.log('web3: window.ethereum');
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.enable();
        ethereum.on('accountsChanged', callbackAccountChanged);
    } else if ((window.web3) || (typeof web3 !== 'undefined')) {
        console.log('web3: window.web3');
        provider = new ethers.providers.Web3Provider(web3.currentProvider);
    } else {
        console.log('web3: only read');
        provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
    }

    return provider;
};
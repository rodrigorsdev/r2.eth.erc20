var ethers = require('ethers');
import R2Token from '../../../build/contracts/R2Token.json';

export const initEthersContract = (provider, $contractAddress) => {
    const deploymentKey = Object.keys(R2Token.networks)[0];
    const contractAddress = R2Token
        .networks[deploymentKey]
        .address;
    console.log(contractAddress);
    const signer = provider.getSigner();
    $contractAddress.innerHTML = ' ' + contractAddress;
    return new ethers.Contract(
        contractAddress,
        R2Token.abi,
        signer);
};
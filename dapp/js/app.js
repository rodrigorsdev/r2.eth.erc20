import Web3 from 'web3';
import R2Token from '../../build/contracts/R2Token.json';

let web3;
let r2Token;

const initWeb3 = async () => {
    return new Promise((resolve, reject) => {
        if (typeof window.web3 !== 'undefined') {
            return resolve(
                new Web3(window.web3.currentProvider)
            );
        }

        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.enable()
                .then(() => {
                    resolve(
                        new Web3(window.ethereum)
                    );
                })
                .catch(e => {
                    reject(e);
                });
            return;
        }

        resolve(new Web3('http://localhost:8545'));
    });
};

const initContract = async () => {
    return new web3.eth.Contract(
        R2Token.abi,
        R2Token.networks['1001'].address
    );
};

const initDapp = async () => {

};

document.addEventListener('DOMContentLoaded', () => {
    initWeb3()
        .then(_web3 => {
            web3 = _web3;
            r2Token = initContract();
            initDapp();
        })
        .catch(e =>
            console.error(e.message)
        );
});
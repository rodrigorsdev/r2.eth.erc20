const Artifact = artifacts.require('../contracts/R2Token');
const Assert = require('truffle-assertions');

contract('R2Token-Lifecycle', (accounts) => {

    const tokenName = 'PDV token';
    const tokenSymbol = 'PDV';
    const tokenDecimals = 18;
    const tokenTotalSupply = 1000000;

    let contractInstance;
    const ownerAddress = accounts[0];
    const address1 = accounts[1];

    before(() => {
        web3.eth.defaultAccount = ownerAddress;
    });

    beforeEach(async () => {
        contractInstance = await Artifact.new(tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply);
    });

    it('contract must not be paused after deploy', async () => {
        const result = await contractInstance.paused();
        
        assert.equal(false, result, 'contract cannot paused after deploy');
    });

    it('pause should throw if account is not admin', async () => {
        await Assert.reverts(
            contractInstance.pause({ from: address1 }),
            'AdminRole: caller does not have the admin role'
        );
    });

    it('pause should throw if contract already paused', async () => {
        await contractInstance.pause({ from: ownerAddress });
        
        await Assert.reverts(
            contractInstance.pause({ from: ownerAddress }),
            'Pausable: paused'
        );
    });

    it('pause success', async () => {
        await contractInstance.pause({ from: ownerAddress });
        const result = await contractInstance.paused();
        
        assert.equal(true, result, 'contract cannot paused after deploy');
    });

});
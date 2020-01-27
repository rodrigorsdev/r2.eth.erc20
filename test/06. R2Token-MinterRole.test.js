const Artifact = artifacts.require('../contracts/R2Token');
const Assert = require('truffle-assertions');

contract('R2Token-MinterRole', (accounts) => {
    
    const tokenName = 'PDV token';
    const tokenSymbol = 'PDV';
    const tokenDecimals = 18;
    const tokenTotalSupply = 1000000;
    
    let contractInstance;
    const ownerAddress = accounts[0];
    const address1 = accounts[1];
    const address2 = accounts[2];

    before(() => {
        web3.eth.defaultAccount = ownerAddress;
    });

    beforeEach(async () => {
        contractInstance = await Artifact.new(tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply);
    });

    it('constructor: should set the owner as minter on contract creation', async () => {
        contractInstance = await Artifact.new(tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply);
        const result = await contractInstance.isBurner(ownerAddress);
        
        assert.equal(true, result, 'not seted burner as admin');
    });

    it('addMinter: should throw if sender is not admin', async () => {
        await Assert.reverts(
            contractInstance.addMinter(address1, { from: address1 }),
            'AdminRole: caller does not have the admin role'
        );
    });

    it('addMinter: add success', async () => {
        await contractInstance.addMinter(address1, { from: ownerAddress });
        const result = await contractInstance.isMinter(address1);
        
        assert.equal(true, result, 'not seted owner as minter');
    });

    it('isMinter: is minter', async () => {
        await contractInstance.addMinter(address1, { from: ownerAddress })
        const result = await contractInstance.isMinter(address1);
       
        assert.equal(true, result, 'not seted address1 as minter');
    });

    it('isMinter: is not minter', async () => {
        const result = await contractInstance.isMinter(address1);
        
        assert.equal(false, result, 'not seted address1 as minter');
    });

    it('minters: list minters', async () => {
        await contractInstance.addMinter(address1, { from: ownerAddress })
        await contractInstance.addMinter(address2, { from: ownerAddress })
        const result = await contractInstance.minters();
       
        assert.equal(3, result.length, 'wrong minters number');
        assert.equal(address1, result[1], 'wrong minter address1');
        assert.equal(address2, result[2], 'wrong minter address2');
    });

    it('removeMinter: should throw if sender is not admin', async () => {
        await Assert.reverts(
            contractInstance.removeMinter(ownerAddress, { from: address1 }),
            'AdminRole: caller does not have the admin role'
        );
    });

    it('removeMinter: remove success', async () => {
        await contractInstance.addMinter(address1, { from: ownerAddress });
        const resultBeforeRemove = await contractInstance.isMinter(address1);
        await contractInstance.removeMinter(address1, { from: ownerAddress });
        const resultAfterRemove = await contractInstance.isMinter(address1);
        
        assert.equal(true, resultBeforeRemove, 'not seted address1 as minter');
        assert.equal(false, resultAfterRemove, 'not removed address1 as minter');
    });
});
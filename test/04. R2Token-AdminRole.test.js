const Artifact = artifacts.require('../contracts/R2Token');
const Assert = require('truffle-assertions');

contract('R2Token-AdminRole', (accounts) => {

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

    it('constructor: should set the owner as admin on contract creation', async () => {
        contractInstance = await Artifact.new(tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply);
        const result = await contractInstance.isAdmin(ownerAddress);
        
        assert.equal(true, result, 'not seted owner as admin');
    });

    it('addAdmin: should throw if sender is not admin', async () => {
        await Assert.reverts(
            contractInstance.addAdmin(address1, { from: address1 }),
            'AdminRole: caller does not have the admin role'
        );
    });

    it('addAdmin: add success', async () => {
        await contractInstance.addAdmin(address1, { from: ownerAddress })
        const result = await contractInstance.isAdmin(address1);
        
        assert.equal(true, result, 'not seted owner as admin');
    });

    it('isAdmin: is admin', async () => {
        await contractInstance.addAdmin(address1, { from: ownerAddress })
        const result = await contractInstance.isAdmin(address1);
        
        assert.equal(true, result, 'not seted address1 as admin');
    });

    it('isAdmin: is not admin', async () => {
        const result = await contractInstance.isAdmin(address1);
        
        assert.equal(false, result, 'not seted address1 as admin');
    });

    it('Admins: list admins', async () => {
        await contractInstance.addAdmin(address1, { from: ownerAddress })
        await contractInstance.addAdmin(address2, { from: ownerAddress })
        const result = await contractInstance.admins();
        
        assert.equal(3, result.length, 'wrong admins number');
        assert.equal(address1, result[1], 'wrong admin address1');
        assert.equal(address2, result[2], 'wrong admin address2');
    });

    it('removeAdmin: should throw if sender is not admin', async () => {
        await Assert.reverts(
            contractInstance.removeAdmin(ownerAddress, { from: address1 }),
            'AdminRole: caller does not have the admin role'
        );
    });

    it('removeAdmin: should throw if sender try to remove yourself', async () => {
        await Assert.reverts(
            contractInstance.removeAdmin(ownerAddress, { from: ownerAddress }),
            'AdminRole: caller can not renounce itself'
        );
    });

    it('removeAdmin: remove success', async () => {
        await contractInstance.addAdmin(address1, { from: ownerAddress });
        const resultBeforeRemove = await contractInstance.isAdmin(address1);
        await contractInstance.removeAdmin(address1, { from: ownerAddress });
        const resultAfterRemove = await contractInstance.isAdmin(address1);
        
        assert.equal(true, resultBeforeRemove, 'not seted address1 as admin');
        assert.equal(false, resultAfterRemove, 'not removed address1 as admin');
    });
});
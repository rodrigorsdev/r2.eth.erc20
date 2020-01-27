const Artifact = artifacts.require('../contracts/R2Token');
const Assert = require('truffle-assertions');

contract('R2Token-BurnerRole', (accounts) => {
    
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

    it('constructor: should set the owner as burner on contract creation', async () => {
        contractInstance = await Artifact.new(tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply);
        const result = await contractInstance.isBurner(ownerAddress);
        
        assert.equal(true, result, 'not seted burner as admin');
    });

    it('addBurner: should throw if sender is not admin', async () => {
        await Assert.reverts(
            contractInstance.addBurner(address1, { from: address1 }),
            'AdminRole: caller does not have the admin role'
        );
    });

    it('addBurner: add success', async () => {
        await contractInstance.addBurner(address1, { from: ownerAddress });
        const result = await contractInstance.isBurner(address1);
        
        assert.equal(true, result, 'not seted owner as burner');
    });

    it('isBurner: is burner', async () => {
        await contractInstance.addBurner(address1, { from: ownerAddress })
        const result = await contractInstance.isBurner(address1);
        
        assert.equal(true, result, 'not seted address1 as burner');
    });

    it('isBurner: is not burner', async () => {
        const result = await contractInstance.isBurner(address1);
        
        assert.equal(false, result, 'not seted address1 as burner');
    });

    it('burners: list burners', async () => {
        await contractInstance.addBurner(address1, { from: ownerAddress })
        await contractInstance.addBurner(address2, { from: ownerAddress })
        const result = await contractInstance.burners();
        
        assert.equal(3, result.length, 'wrong burners number');
        assert.equal(address1, result[1], 'wrong burner address1');
        assert.equal(address2, result[2], 'wrong burner address2');
    });

    it('removeBurner: should throw if sender is not admin', async () => {
        await Assert.reverts(
            contractInstance.removeBurner(ownerAddress, { from: address1 }),
            'AdminRole: caller does not have the admin role'
        );
    });

    it('removeBurner: remove success', async () => {
        await contractInstance.addBurner(address1, { from: ownerAddress });
        const resultBeforeRemove = await contractInstance.isBurner(address1);
        await contractInstance.removeBurner(address1, { from: ownerAddress });
        const resultAfterRemove = await contractInstance.isBurner(address1);
        
        assert.equal(true, resultBeforeRemove, 'not seted address1 as burner');
        assert.equal(false, resultAfterRemove, 'not removed address1 as burner');
    });
});
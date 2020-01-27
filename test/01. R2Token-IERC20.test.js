const Artifact = artifacts.require('../contracts/R2Token');
const Assert = require('truffle-assertions');

contract('R2Token-IERC20', (accounts) => {

    const tokenName = 'token';
    const tokenSymbol = 'TKN';
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

    //constructor
    it('constructor: set name', async () => {
        contractInstance = await Artifact.new(tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply);
        const result = await contractInstance.name();
        
        assert.equal(tokenName, result, 'name is wrong');
    });

    it('constructor: set symbol', async () => {
        contractInstance = await Artifact.new(tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply);
        const result = await contractInstance.symbol();
        
        assert.equal(tokenSymbol, result, 'symbol is wrong');
    });

    it('constructor: set decimals', async () => {
        contractInstance = await Artifact.new(tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply);
        const result = await contractInstance.decimals();
        
        assert.equal(tokenDecimals, result, 'decimals is wrong');
    });

    it('constructor: set totalSupply', async () => {
        contractInstance = await Artifact.new(tokenName, tokenSymbol, tokenDecimals, tokenTotalSupply);
        const result = await contractInstance.totalSupply();
        
        assert.equal(tokenTotalSupply, result, 'totalSupply is wrong');
    });

    //transfer
    it('transfer: should throw if contract is paused', async () => {
        await contractInstance.pause({ from: ownerAddress });
        
        await Assert.reverts(
            contractInstance.transfer(address1, 1000, { from: ownerAddress }),
            'Pausable: paused'
        );
    });

    it('transfer: should throw if to address is not valid', async () => {
        await Assert.reverts(
            contractInstance.transfer('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress }),
            'R2Token: to address is not valid'
        );
    });

    it('transfer: should throw if balance is insufficient', async () => {
        await Assert.reverts(
            contractInstance.transfer(ownerAddress, 1000, { from: address1 }),
            'R2Token: insufficient balance'
        );
    });

    it('transfer: success', async () => {
        const result = await contractInstance.transfer(address1, 1000, { from: ownerAddress });
       
        Assert.eventEmitted(result, 'Transfer');
    });

    //balanceOf
    it('balanceOf: success', async () => {
        const result = await contractInstance.balanceOf(ownerAddress, { from: ownerAddress });
        
        assert.equal(result.toNumber(), tokenTotalSupply, 'balance is wrong');
    });

    //approve
    it('approve: should throw if contract is paused', async () => {
        await contractInstance.pause({ from: ownerAddress });
        
        await Assert.reverts(
            contractInstance.approve(address1, 1000, { from: ownerAddress }),
            'Pausable: paused'
        );
    });

    it('approve: success', async () => {
        const result = await contractInstance.approve(address1, 1000, { from: ownerAddress });
        
        Assert.eventEmitted(result, 'Approval');
    });

    //transferFrom
    it('transferFrom: should throw if contract is paused', async () => {
        await contractInstance.pause({ from: ownerAddress });
        
        await Assert.reverts(
            contractInstance.transferFrom(ownerAddress, address2, 1000, { from: address1 }),
            'Pausable: paused'
        );
    });

    it('transferFrom: should throw if from address is not valid', async () => {
        await Assert.reverts(
            contractInstance.transferFrom('0x0000000000000000000000000000000000000000', address1, 1000, { from: ownerAddress }),
            'R2Token: from address is not valid'
        );
    });

    it('transferFrom: should throw if to address is not valid', async () => {
        await Assert.reverts(
            contractInstance.transferFrom(address1, '0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress }),
            'R2Token: to address is not valid'
        );
    });

    it('transferFrom: should throw if balance is insufficient', async () => {
        await Assert.reverts(
            contractInstance.transferFrom(address1, address2, 1000, { from: address1 }),
            'R2Token: insufficient balance'
        );
    });

    it('transferFrom: should throw if sender is not approved', async () => {
        await Assert.reverts(
            contractInstance.transferFrom(ownerAddress, address1, 1000, { from: ownerAddress }),
            'R2Token: from not allowed'
        );
    });

    it('transferFrom: success', async () => {
        await contractInstance.transfer(address1, 1000, { from: ownerAddress });
        await contractInstance.approve(address1, 1000, { from: ownerAddress });
        const result = await contractInstance.transferFrom(ownerAddress, address2, 1000, { from: address1 });
        
        Assert.eventEmitted(result, 'Transfer');
    });

    //allowance
    it('allowance: should throw if contract is paused', async () => {
        await contractInstance.pause({ from: ownerAddress });
        
        await Assert.reverts(
            contractInstance.allowance(ownerAddress, address1, { from: ownerAddress }),
            'Pausable: paused'
        );
    });

    it('allowance: not allowance', async () => {
        const result = await contractInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(0, result.toNumber(), 'wrong result');
    });

    it('allowance: allowance', async () => {
        const expectedAmount = 1000;
        
        await contractInstance.approve(address1, expectedAmount, { from: ownerAddress });
        const result = await contractInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(expectedAmount, result.toNumber(), 'wrong result');
    });

    //increaseApproval
    
    it('increaseApproval: should throw if contract is paused', async () => {
        const initialAmount = 1000;
        
        await contractInstance.pause({ from: ownerAddress });
        
        await Assert.reverts(
            contractInstance.increaseApproval(address1, initialAmount, { from: ownerAddress }),
            'Pausable: paused'
        );
    });

    it('increaseApproval: success', async () => {
        const initialAmount = 1000;
        const expectedAmount = 2000;
        
        await contractInstance.approve(address1, initialAmount, { from: ownerAddress });
        const resultBeforeIncrease = await contractInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        const resultIncrease = await contractInstance.increaseApproval(address1, initialAmount, { from: ownerAddress });
        const resultAfterIncrease = await contractInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(initialAmount, resultBeforeIncrease.toNumber(), 'wrong result berore increase');
        assert.equal(expectedAmount, resultAfterIncrease.toNumber(), 'wrong result after increase');
        Assert.eventEmitted(resultIncrease, 'Approval');
    });

    //decreaseApproval
    it('decreaseApproval: should throw if contract is paused', async () => {
        const initialAmount = 1000;
        
        await contractInstance.pause({ from: ownerAddress });
        
        await Assert.reverts(
            contractInstance.decreaseApproval(address1, initialAmount, { from: ownerAddress }),
            'Pausable: paused'
        );
    });

    it('decreaseApproval: success', async () => {
        const initialAmount = 1000;
        const expectedAmount = 500;
        
        await contractInstance.approve(address1, initialAmount, { from: ownerAddress });
        const resultBeforeDecrease = await contractInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        const resultDecrease = await contractInstance.decreaseApproval(address1, 500, { from: ownerAddress });
        const resultAfterDecrease = await contractInstance.allowance(ownerAddress, address1, { from: ownerAddress });
        
        assert.equal(initialAmount, resultBeforeDecrease.toNumber(), 'wrong result berore increase');
        assert.equal(expectedAmount, resultAfterDecrease.toNumber(), 'wrong result after increase');
        Assert.eventEmitted(resultDecrease, 'Approval');
    });

    //mintTo
    it('mintTo: should throw if contract is paused', async () => {
        const mintValue = 1000;
        
        await contractInstance.pause({ from: ownerAddress });
        
        await Assert.reverts(
            contractInstance.mintTo(address1, mintValue, { from: address1 }),
            'Pausable: paused'
        );
    });

    it('mintTo: should throw if to address is invalid', async () => {
        await Assert.reverts(
            contractInstance.mintTo('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress }),
            'R2Token: to address is not valid'
        );
    });

    it('mintTo: should throw if amount is invalid', async () => {
        await Assert.reverts(
            contractInstance.mintTo(address1, 0, { from: ownerAddress }),
            'R2Token: amount is not valid'
        );
    });

    it('mintTo: should throw if account is not a minter', async () => {
        const mintValue = 1000;

        await Assert.reverts(
            contractInstance.mintTo(address1, mintValue, { from: address1 }),
            'MinterRole: caller does not have the Minter role'
        );
    });

    it('mintTo: success', async () => {
        const mintValue = 1000;

        const resultBeforeMint = await contractInstance.totalSupply();
        await contractInstance.addMinter(address1, { from: ownerAddress });
        await contractInstance.mintTo(address1, mintValue, { from: address1 });
        const expectedTotalSupply = resultBeforeMint.toNumber() + mintValue;
        const resultAfterMint = await contractInstance.totalSupply();
        const resultBalanceOf = await contractInstance.balanceOf(address1, { from: address1 });

        assert.equal(tokenTotalSupply, resultBeforeMint, 'wrong totalSupply before');
        assert.equal(expectedTotalSupply, resultAfterMint, 'wrong totalSupply after');
        assert.equal(mintValue, resultBalanceOf, 'wrong balance');
    });

    //burnFrom
    it('burnFrom: should throw if contract is paused', async () => {
        const burnValue = 1000;
        
        await contractInstance.pause({ from: ownerAddress });
        
        await Assert.reverts(
            contractInstance.burnFrom(address1, burnValue, { from: address1 }),
            'Pausable: paused'
        );
    });

    it('burnFrom: should throw if from address is invalid', async () => {
        await Assert.reverts(
            contractInstance.burnFrom('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress }),
            'R2Token: from address is not valid'
        );
    });

    it('burnFrom: should throw if balance is insufficient', async () => {
        await Assert.reverts(
            contractInstance.burnFrom(address1, 1000, { from: ownerAddress }),
            'R2Token: insufficient balance'
        );
    });

    it('burnFrom: should throw if account is not a burner', async () => {
        const mintValue = 1000;
        const burnValue = 500;

        await contractInstance.addMinter(address1, { from: ownerAddress });
        await contractInstance.mintTo(address1, mintValue, { from: address1 });
        
        await Assert.reverts(
            contractInstance.burnFrom(address1, burnValue, { from: address1 }),
            'BurnerRole: caller does not have the burner role'
        );
    });

    it('burnFrom: success', async () => {
        const mintValue = 1000;
        const burnValue = 500;
        const expectedBalance = 500;

        await contractInstance.addMinter(address1, { from: ownerAddress });
        await contractInstance.mintTo(address1, mintValue, { from: address1 });
        await contractInstance.addBurner(address1, { from: ownerAddress });
        await contractInstance.burnFrom(address1, burnValue, { from: address1 });
        const expectedTotalSupply = (tokenTotalSupply + mintValue) - burnValue;
        const resultAfterBurn = await contractInstance.totalSupply();
        const resultBalanceOf = await contractInstance.balanceOf(address1, { from: address1 });

        assert.equal(expectedTotalSupply, resultAfterBurn, 'wrong totalSupply after');
        assert.equal(expectedBalance, resultBalanceOf, 'wrong balance');
    });
});
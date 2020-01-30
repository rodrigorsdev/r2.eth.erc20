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

    describe('constructor', () => {
        it('set name', async () => {
            const result = await contractInstance.name();

            assert.equal(tokenName, result, 'name is wrong');
        });

        it('set symbol', async () => {
            const result = await contractInstance.symbol();

            assert.equal(tokenSymbol, result, 'symbol is wrong');
        });

        it('set decimals', async () => {
            const result = await contractInstance.decimals();

            assert.equal(tokenDecimals, result, 'decimals is wrong');
        });

        it('set totalSupply', async () => {
            const result = await contractInstance.totalSupply();

            assert.equal(tokenTotalSupply, result, 'totalSupply is wrong');
        });
    });

    describe('transfer', () => {
        it('should throw if contract is paused', async () => {
            await contractInstance.pause({ from: ownerAddress });

            await Assert.reverts(
                contractInstance.transfer(address1, 1000, { from: ownerAddress }),
                'Pausable: paused'
            );
        });

        it('should throw if to address is not valid', async () => {
            await Assert.reverts(
                contractInstance.transfer('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress }),
                'R2Token: to address is not valid'
            );
        });

        it('should throw if balance is insufficient', async () => {
            await Assert.reverts(
                contractInstance.transfer(ownerAddress, 1000, { from: address1 }),
                'R2Token: insufficient balance'
            );
        });

        it('success', async () => {
            const result = await contractInstance.transfer(address1, 1000, { from: ownerAddress });

            Assert.eventEmitted(result, 'Transfer');
        });
    });

    describe('balanceOf', () => {
        it('success', async () => {
            const result = await contractInstance.balanceOf(ownerAddress, { from: ownerAddress });

            assert.equal(result.toNumber(), tokenTotalSupply, 'balance is wrong');
        });
    });

    describe('approve', () => {
        it('should throw if contract is paused', async () => {
            await contractInstance.pause({ from: ownerAddress });

            await Assert.reverts(
                contractInstance.approve(address1, 1000, { from: ownerAddress }),
                'Pausable: paused'
            );
        });

        it('success', async () => {
            const result = await contractInstance.approve(address1, 1000, { from: ownerAddress });

            Assert.eventEmitted(result, 'Approval');
        });
    });

    describe('transferFrom', () => {
        it('should throw if contract is paused', async () => {
            await contractInstance.pause({ from: ownerAddress });

            await Assert.reverts(
                contractInstance.transferFrom(ownerAddress, address2, 1000, { from: address1 }),
                'Pausable: paused'
            );
        });

        it('should throw if from address is not valid', async () => {
            await Assert.reverts(
                contractInstance.transferFrom('0x0000000000000000000000000000000000000000', address1, 1000, { from: ownerAddress }),
                'R2Token: from address is not valid'
            );
        });

        it('should throw if to address is not valid', async () => {
            await Assert.reverts(
                contractInstance.transferFrom(address1, '0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress }),
                'R2Token: to address is not valid'
            );
        });

        it('should throw if balance is insufficient', async () => {
            await Assert.reverts(
                contractInstance.transferFrom(address1, address2, 1000, { from: address1 }),
                'R2Token: insufficient balance'
            );
        });

        it('should throw if sender is not approved', async () => {
            await Assert.reverts(
                contractInstance.transferFrom(ownerAddress, address1, 1000, { from: ownerAddress }),
                'R2Token: from not allowed'
            );
        });

        it('success', async () => {
            await contractInstance.transfer(address1, 1000, { from: ownerAddress });
            await contractInstance.approve(address1, 1000, { from: ownerAddress });
            const result = await contractInstance.transferFrom(ownerAddress, address2, 1000, { from: address1 });

            Assert.eventEmitted(result, 'Transfer');
        });
    });

    describe('allowance', () => {
        it('should throw if contract is paused', async () => {
            await contractInstance.pause({ from: ownerAddress });

            await Assert.reverts(
                contractInstance.allowance(ownerAddress, address1, { from: ownerAddress }),
                'Pausable: paused'
            );
        });

        it('not allowance', async () => {
            const result = await contractInstance.allowance(ownerAddress, address1, { from: ownerAddress });

            assert.equal(0, result.toNumber(), 'wrong result');
        });

        it('allowance', async () => {
            const expectedAmount = 1000;

            await contractInstance.approve(address1, expectedAmount, { from: ownerAddress });
            const result = await contractInstance.allowance(ownerAddress, address1, { from: ownerAddress });

            assert.equal(expectedAmount, result.toNumber(), 'wrong result');
        });
    });

    describe('increaseApproval', () => {
        it('should throw if contract is paused', async () => {
            const initialAmount = 1000;

            await contractInstance.pause({ from: ownerAddress });

            await Assert.reverts(
                contractInstance.increaseApproval(address1, initialAmount, { from: ownerAddress }),
                'Pausable: paused'
            );
        });

        it('success', async () => {
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
    });

    describe('decreaseApproval', () => {
        it('should throw if contract is paused', async () => {
            const initialAmount = 1000;

            await contractInstance.pause({ from: ownerAddress });

            await Assert.reverts(
                contractInstance.decreaseApproval(address1, initialAmount, { from: ownerAddress }),
                'Pausable: paused'
            );
        });

        it('success', async () => {
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
    });

    describe('mintTo', () => {
        it('should throw if contract is paused', async () => {
            const mintValue = 1000;

            await contractInstance.pause({ from: ownerAddress });

            await Assert.reverts(
                contractInstance.mintTo(address1, mintValue, { from: address1 }),
                'Pausable: paused'
            );
        });

        it('should throw if to address is invalid', async () => {
            await Assert.reverts(
                contractInstance.mintTo('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress }),
                'R2Token: to address is not valid'
            );
        });

        it('should throw if amount is invalid', async () => {
            await Assert.reverts(
                contractInstance.mintTo(address1, 0, { from: ownerAddress }),
                'R2Token: amount is not valid'
            );
        });

        it('should throw if account is not a minter', async () => {
            const mintValue = 1000;

            await Assert.reverts(
                contractInstance.mintTo(address1, mintValue, { from: address1 }),
                'MinterRole: caller does not have the Minter role'
            );
        });

        it('success', async () => {
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
    });

    describe('burnFrom', () => {
        it('should throw if contract is paused', async () => {
            const burnValue = 1000;

            await contractInstance.pause({ from: ownerAddress });

            await Assert.reverts(
                contractInstance.burnFrom(address1, burnValue, { from: address1 }),
                'Pausable: paused'
            );
        });

        it('should throw if from address is invalid', async () => {
            await Assert.reverts(
                contractInstance.burnFrom('0x0000000000000000000000000000000000000000', 1000, { from: ownerAddress }),
                'R2Token: from address is not valid'
            );
        });

        it('should throw if balance is insufficient', async () => {
            await Assert.reverts(
                contractInstance.burnFrom(address1, 1000, { from: ownerAddress }),
                'R2Token: insufficient balance'
            );
        });

        it('should throw if account is not a burner', async () => {
            const mintValue = 1000;
            const burnValue = 500;

            await contractInstance.addMinter(address1, { from: ownerAddress });
            await contractInstance.mintTo(address1, mintValue, { from: address1 });

            await Assert.reverts(
                contractInstance.burnFrom(address1, burnValue, { from: address1 }),
                'BurnerRole: caller does not have the burner role'
            );
        });

        it('success', async () => {
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
});
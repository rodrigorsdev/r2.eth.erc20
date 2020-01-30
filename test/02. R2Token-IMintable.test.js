const Artifact = artifacts.require('../contracts/R2Token');
const Assert = require('truffle-assertions');

contract('R2Token-IMintable', (accounts) => {

    const tokenName = 'token';
    const tokenSymbol = 'TKN';
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
});
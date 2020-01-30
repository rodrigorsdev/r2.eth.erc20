const Migrations = artifacts.require("R2Token");

require('dotenv').config();

const name = process.env.TOKEN_NAME;
const symbol = process.env.TOKEN_SYMBOL;
const decimals = process.env.TOKEN_DECIMALS;
const totalSupply = process.env.TOKEN_TOTALSUPLY;

module.exports = function (deployer) {
    deployer.deploy(
        Migrations,
        name,
        symbol,
        decimals,
        totalSupply);
};

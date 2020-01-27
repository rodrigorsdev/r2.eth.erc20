# R2 ERC20 Token

## Requeriments

- [Node.js](https://nodejs.org/download/release/latest-v10.x/): `>=10.0.0`
- [Solidity](https://solidity.readthedocs.io/en/v0.5.12/): `v0.5.12`
- [Truffle](https://www.trufflesuite.com/truffle): `v5.1.9`

## Usage

### Compile contracts

```sh
truffle compile
```

After running, contract information &mdash; including ABI &mdash; will be available at the `build/contracts/` directory.

### Run tests

```sh
truffle test
```

To run tests within a specific file:

```sh
truffle test <file_path>
```

### Deploy contracts

Create .env file on root with:

```
MNENOMIC = // Your metamask's recovery words
INFURA_API_KEY = // Your Infura API Key after its registration
TOKEN_NAME = //Token name
TOKEN_SYMBOL = //Token symbol
TOKEN_DECIMALS = //Token decimals
TOKEN_TOTALSUPLY = //Token total supply
```
Run migrate command

```sh
truffle migrate --network <network_name>
```

Contract address and transaction ID will be shown on screen.
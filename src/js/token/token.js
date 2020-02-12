let $tokenName;
let $tokenTotalsupply;
let $tokenSymbol;

let contractInstance;

export const registerTokenElements = (
    _tokenName,
    _tokenTotalsupply,
    _tokenSymbol,
    _contractInstance
) => {
    $tokenName = _tokenName;
    $tokenTotalsupply = _tokenTotalsupply;
    $tokenSymbol = tokenSymbol;
    contractInstance = _contractInstance;
};

export const setTokenInfo = async () => {
    const tokenName = await contractInstance.name();
    const tokenSymbol = await contractInstance.symbol();

    $tokenName.innerHTML = tokenName;
    $tokenSymbol.innerHTML = tokenSymbol;
};

export const setTotalSupply = async (
) => {
    const tokenTotalSupply = await contractInstance.totalSupply();
    $tokenTotalsupply.innerHTML = tokenTotalSupply;
};
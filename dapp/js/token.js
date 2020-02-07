let contractInstance;

export const setTokenInfo = async (
    $tokenName,
    $tokenTotalsupply,
    $tokenSymbol,
    _contractInstance
) => {
    contractInstance = _contractInstance;

    const tokenName = await contractInstance.methods.name().call();
    const tokenTotalSupply = await contractInstance.methods.totalSupply().call();
    const tokenSymbol = await contractInstance.methods.symbol().call();

    $tokenName.innerHTML = tokenName;
    $tokenTotalsupply.innerHTML = tokenTotalSupply;
    $tokenSymbol.innerHTML = tokenSymbol;
};
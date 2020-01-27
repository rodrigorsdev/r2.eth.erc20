pragma solidity ^0.5.12;

import '../Roles.sol';
import './AdminRole.sol';

contract BurnerRole is AdminRole {

    using Roles for Roles.Role;

    event BurnerAdded(address indexed _account);
    event BurnerRemoved(address indexed _account);

    Roles.Role private _burners;

    modifier onlyBurner() {
        require(isBurner(msg.sender), 'BurnerRole: caller does not have the burner role');
        _;
    }

    constructor () internal 
    {
        _internalAddBurner(msg.sender);
    }

    function isBurner(
        address _account
    ) public view returns (bool) 
    {
        return _burners.has(_account);
    }

    function burners(
    ) public view returns (address[] memory)
    {
        return _burners.bearers();
    }

    function addBurner(
        address _account
    ) public 
        onlyAdmin 
    {
        _internalAddBurner(_account);
    }

    function removeBurner(
        address _account
    ) public 
        onlyAdmin 
    {
        _internalRemoveBurner(_account);
    }

    function _internalAddBurner(
        address _account
    ) internal 
    {
        _burners.add(_account);
        emit BurnerAdded(_account);
    }

    function _internalRemoveBurner(
        address _account
    ) internal 
    {
        _burners.remove(_account);
        emit BurnerRemoved(_account);
    }
}
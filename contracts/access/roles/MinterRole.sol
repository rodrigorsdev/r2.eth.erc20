pragma solidity ^0.5.12;

import '../Roles.sol';
import './AdminRole.sol';

contract MinterRole is AdminRole {
    
    using Roles for Roles.Role;

    event MinterAdded(address indexed _account);
    event MinterRemoved(address indexed _account);

    Roles.Role private _minters;

    modifier onlyMinter() {
        require(isMinter(msg.sender), 'MinterRole: caller does not have the Minter role');
        _;
    }

    constructor() internal {
        _internalAddMinter(msg.sender);
    }

    function isMinter(
        address _account
    ) public view returns (bool) 
    {
        return _minters.has(_account);
    }

    function minters(
    ) public view returns (address[] memory) 
    {
        return _minters.bearers();
    }

    function addMinter(
        address _account
    ) public 
        onlyAdmin 
    {
        _internalAddMinter(_account);
    }

    function removeMinter(
        address _account
    ) public 
        onlyAdmin 
    {
        _internalRemoveMinter(_account);
    }

    function _internalAddMinter(
        address _account
    ) internal 
    {
        _minters.add(_account);
        emit MinterAdded(_account);
    }

    function _internalRemoveMinter(
        address _account
    ) internal 
    {
        _minters.remove(_account);
        emit MinterRemoved(_account);
    }
}
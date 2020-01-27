pragma solidity ^0.5.12;

interface IMintable {
    function mintTo(address _to, uint _amount) external;
    function burnFrom(address _from, uint _amount) external;
}
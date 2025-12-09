pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract METoken is ERC20 {
    uint private constant _initial_supply = 2100000000;

    constructor() ERC20("Mastering Ethereum Token", "MET") {
        _mint(msg.sender, _initial_supply);
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }
}

// Version of Solidity compiler this program was written for
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';


// A faucet for ERC20 token MET
contract METFaucet {

	ERC20 public METoken;
	address public METOwner;

	// METFaucet constructor, provide the address of METoken contract and
	// the owner address we will be approved to transferFrom
	constructor(address _METoken, address _METOwner) {

		// Initialize the METoken from the address provided
		METoken = ERC20(_METoken);
		METOwner = _METOwner;
	}

	function withdraw(uint withdraw_amount) public {

    	// Limit withdrawal amount to 10 MET
    	require(withdraw_amount <= 1000);

		// Use the transferFrom function of METoken
		METoken.transferFrom(METOwner, msg.sender, withdraw_amount);
    }

	// REJECT any incoming ether
	fallback() external payable { revert(); }


}

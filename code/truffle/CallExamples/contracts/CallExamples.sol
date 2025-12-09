pragma solidity ^0.8.20;

contract calledContract {
	event callEvent(address sender, address origin, address from);
	function calledFunction() public {
		emit callEvent(msg.sender, tx.origin, address(this));
	}
}

library calledLibrary {
	event callEvent(address sender, address origin,  address from);
	function calledFunction() public {
		emit callEvent(msg.sender, tx.origin, address(this));
	}
}

contract caller {

	function make_calls(calledContract _calledContract) public {

		// Calling the calledContract and calledLibrary directly
		_calledContract.calledFunction();
		calledLibrary.calledFunction();

		// Low level calls using the address object for calledContract
		(bool success, ) = address(_calledContract).call(abi.encodeWithSignature("calledFunction()"));
		require(success);
		(bool success2, ) = address(_calledContract).delegatecall(abi.encodeWithSignature("calledFunction()"));
		require(success2);



	}
}

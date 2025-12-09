#!/usr/bin/env node

/**
 * @author Francisco Javier Rojas García <fjrojasgarcia@gmail.com>
 * Updated for Web3.js v4 and Sepolia testnet
 */

console.log('Mastering Ethereum - web3.js basic interactions using async/await')

const { Web3 } = require('web3');
const axios = require('axios'); // Modern replacement for node-rest-client-promise

// Prepare your Infura host url (or any public RPC)
const infura_host = "https://rpc.sepolia.org";

// Instantiate web3 provider
const web3 = new Web3(infura_host);

// Let's do some basic interactions at web3 level
async function basicInterations() {
  try {
    // Let's see the Protocol Version
    // Note: getProtocolVersion is deprecated/removed in some v4 providers or returns a hex string
    try {
        var protocolVersion = await web3.eth.getProtocolVersion();
        console.log(`Protocol Version: ${protocolVersion}`);
    } catch(e) { console.log("Protocol version not supported by provider"); }

    // Now I'm curious about the current gas price
    var gasPrice = await web3.eth.getGasPrice();
    console.log(`Gas Price: ${gasPrice} wei`);

    // And, Whats the last mined block in my chain?
    var blockNumber = await web3.eth.getBlockNumber();
    console.log(`Block Number: ${blockNumber}`);

    // Now let's dive into some basics actions with a contract
    // We will use the WETH contract on Sepolia
    // https://sepolia.etherscan.io/address/0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14

    // First things first, let's initialize our contract address
    var our_contract_address = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";

    // Let's see its balance
    var balance = await web3.eth.getBalance(our_contract_address);
    console.log(`Balance of ${our_contract_address}: ${balance} wei`);

    // Now let's see its byte code
    var code = await web3.eth.getCode(our_contract_address);
    // console.log("Contract code: ", code.substring(0, 50) + "..."); // Truncated for readability

    // Let's initialize our contract url in Etherscan for Sepolia chain
    var etherescan_url = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${our_contract_address}`
    
    // Note: You might need an API key for Etherscan in production, but often works without for low rate
    console.log("Fetching ABI from:", etherescan_url);

    const response = await axios.get(etherescan_url);
    
    if (response.data.status !== '1') {
        throw new Error("Failed to fetch ABI: " + response.data.result);
    }

    // We get here our contract ABI
    var our_contract_abi = JSON.parse(response.data.result);

    // Let's instantiate our contract object
    var our_contract = new web3.eth.Contract(our_contract_abi, our_contract_address);

    // Let's see our contract address
    console.log(`Our Contract address:  ${our_contract.options.address}`);

    // Now let's see our contract total supply
    var totalSupply = await our_contract.methods.totalSupply().call();
    console.log(`Total Supply of WETH:  ${totalSupply}`);

    // Now let's see our contract public variable name  
    var name = await our_contract.methods.name().call();
    console.log(`Token Name:  ${name}`);

    // Now let's see our contract public variable symbol  
    var symbol = await our_contract.methods.symbol().call();
    console.log(`Token Symbol:  ${symbol}`);

  } catch (error) {
      console.error("An error occurred:", error);
  }
}

// Let's interact with a node
basicInterations();


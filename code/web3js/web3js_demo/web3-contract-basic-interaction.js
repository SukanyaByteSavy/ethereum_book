#!/usr/bin/env node

/**
 * @author Francisco Javier Rojas García <fjrojasgarcia@gmail.com>
 * Updated for Web3.js v4 and Sepolia testnet
 */

console.log('Mastering Ethereum - web3.js basic interactions')

const optionDefinitions = [
  { name: 'localRPC', alias: 'l', type: Boolean },
  { name: 'infuraFileToken', type: String, defaultOption: true }
]

const commandLineArgs = require('command-line-args')
const options = commandLineArgs(optionDefinitions)

const { Web3 } = require('web3');
const fs = require('fs');
const axios = require('axios');

let infura_host = "https://rpc.sepolia.org"; // Default to public

if (options.infuraFileToken && !options.localRPC) {
  try {
      // Loading an Infura Token from a file
      var infura_token = fs.readFileSync(options.infuraFileToken, 'utf8').trim();
      console.log("Using Infura Token:", infura_token);
      infura_host = `https://sepolia.infura.io/v3/${infura_token}`
  } catch (e) {
      console.error("Error reading token file. Using public RPC.");
  }
}

// Instantiate web3 provider
const web3 = new Web3(infura_host);

console.log('Connecting to:', infura_host);

async function main() {
    try {
        // Protocol Version
        try {
            const protocolVersion = await web3.eth.getProtocolVersion();
            console.log(`Protocol Version: ${protocolVersion}`);
        } catch(e) {}

        const gasPrice = await web3.eth.getGasPrice();
        console.log(`Gas Price: ${gasPrice} wei`);

        const blockNumber = await web3.eth.getBlockNumber();
        console.log(`Block Number: ${blockNumber}`);

        // Contract: WETH on Sepolia
        const our_contract_address = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";

        const balance = await web3.eth.getBalance(our_contract_address);
        console.log(`Balance of ${our_contract_address}: ${balance} wei`);

        // Get ABI
        const etherescan_url = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${our_contract_address}`
        console.log("Fetching ABI...");
        
        const response = await axios.get(etherescan_url);
        if (response.data.status !== '1') throw new Error("Failed to fetch ABI");
        
        const our_contract_abi = JSON.parse(response.data.result);
        const our_contract = new web3.eth.Contract(our_contract_abi, our_contract_address);

        console.log(`Contract Address: ${our_contract.options.address}`);

        // Calls
        const totalSupply = await our_contract.methods.totalSupply().call();
        console.log(`Total Supply: ${totalSupply}`);

    } catch (error) {
        console.error("Error:", error);
    }
}

main();

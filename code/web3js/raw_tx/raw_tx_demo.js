// Load requirements first:
//
// npm init -y
// npm install web3
//
// Run with: $ node raw_tx_demo.js

const { Web3 } = require('web3');

// Connect to a node (using a public provider for demonstration)
const web3 = new Web3('https://rpc.sepolia.org');

async function main() {
    const txData = {
        nonce: '0x0',
        gasPrice: '0x09184e72a000',
        gasLimit: '0x30000',
        to: '0xb0920c523d582040f2bcb1bd7fb1c7c1ecebdb34',
        value: '0x00',
        data: '0x',
        chainId: 11155111, // Sepolia Chain ID
    };

    console.log('Transaction Data:', txData);

    // Sign transaction
    // WARNING: Never hardcode private keys in production!
    const privKey = '0x91c8360c4cb4b5fac45513a7213f31d4e4a7bfcb4630e9fbf074f42a203ac0b9';
    
    try {
        const signedTx = await web3.eth.accounts.signTransaction(txData, privKey);
        
        console.log('-----------------------------------------');
        console.log('Signed Transaction V, R, S:', signedTx.v, signedTx.r, signedTx.s);
        console.log('-----------------------------------------');
        console.log('Raw Transaction:', signedTx.rawTransaction);
        console.log('-----------------------------------------');
        console.log('Transaction Hash:', signedTx.transactionHash);

    } catch (error) {
        console.error('Error signing transaction:', error);
    }
}

main();

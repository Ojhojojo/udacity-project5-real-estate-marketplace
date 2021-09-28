var HDWalletProvider = require("truffle-hdwallet-provider");
const infuraKey = "";
const mnemonic = "";

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none) // port for Ganache UI :7545 
      network_id: "*",       // Any network (default: none)
    },

    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
        network_id: 4,       // rinkeby's id
        gas: 4500000,        // rinkeby has a lower block limit than mainnet
        gasPrice: 10000000000,
        timeoutBlocks: 200,
    },
  
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      //version: "0.5.16",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
}

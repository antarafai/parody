require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy");

module.exports = {
  solidity: "0.8.0",
  paths: {
    artifacts: './src/artifacts', // This is where the compiled contracts will be stored
  },
  networks: {
    theta: {
      url: "https://eth-rpc-api.thetatoken.org/rpc", // Theta RPC URL
      accounts: [process.env.PRIVATE_KEY], // Private key of the deployer account
    },
  },
};
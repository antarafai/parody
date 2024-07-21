require('@nomiclabs/hardhat-waffle');


const config = {
  solidity: '0.8.0',
  paths: {
    artifacts: './src/artifacts',
  },
  defaultNetwork: "theta_testnet",
  networks: {
    theta_testnet: {
      url: 'https://eth-rpc-api-testnet.thetatoken.org/rpc',
      accounts: ["0xd46d6e2fb31fedceb74ef8286802ea3d2a8b7d81"],
      chainId: 365,
      gasPrice: 1000000000,
    },
  },
};

module.exports = config;
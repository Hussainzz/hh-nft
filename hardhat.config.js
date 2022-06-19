require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require("hardhat-contract-sizer");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork:"hardhat",
  networks: {
    hardhat:{
      chainId: 31337,
      blockConfirmations: 1
    },
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL || "",
      accounts:
        process.env.P2_KEY !== undefined ? [process.env.P2_KEY] : [],
      chainId: 4,
      blockConfirmations: 6
    },
    mumbai:{
      url: process.env.MUMBAI_RPC_URL || "",
      accounts:
        process.env.P3_KEY !== undefined ? [process.env.P3_KEY] : [],
      chainId: 80001,
      blockConfirmations: 6
    }
  },
  solidity: {
    compilers:[
      {version: "0.8.8"}
    ]
  },
  namedAccounts:{
    deployer: {
      default:0
    },
    player:{
      default:1
    }
  },
  gasReporter:{
    enabled: false,
    outputFile: "gas-report.txt",
    noColors:true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKET,
    token: "ETH"
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha:{
    timeout: 1000000
  }
};

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "dotenv/config";

const RINKEBY_RPC_URL = <string>process.env.RINKEBY_RPC_URL;
const PRIVATE_KEY = <string>process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = <string>process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = <string>process.env.COINMARKETCAP_API_KEY;

// const KOVAN_RPC_URL = "test";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
    },
    // kovan: {
    //   url: KOVAN_RPC_URL,
    //   accounts: [PRIVATE_KEY],
    //   chainId: 42,
    //   gas: 6000000,
    // },
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.8",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
};

export default config;

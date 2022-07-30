import { getNamedAccounts, deployments, network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { verify } from "../utils/verify";

export const deployFunc: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  console.log("Deploy Function");
  const { getNamedAccounts, deployments } = hre;

  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId: number = <number>network.config.chainId;
  // const chainId = 4;

  // const address = networkConfig[chainId]["ethUsdPriceFeed"];

  console.log("2");

  let address;
  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    address = ethUsdAggregator.address;
  } else {
    const config: any = networkConfig;
    address = config[chainId]["ethUsdPriceFeed"];
  }

  console.log("3");

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [address],
    log: true,
    waitConfirmations: 3,
  });

  console.log("4");

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, [address]);
  }

  log("-----------------------------------------");
  log("Fund me Deployed", fundMe.address);
};

export default deployFunc;
export const tags = ["all", "fundMe"];

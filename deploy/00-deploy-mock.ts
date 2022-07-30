import { network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DECIMALS, INITIAL_ANSWER } from "../helper-hardhat-config";

export const deployFunc: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { deploy, log } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();
  const chainId = network.config.chainId;

  console.log("Chain", chainId);

  if (chainId == 31337) {
    log("Local network detected. Deployment mocks");

    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log("Mock deployed");
    log("-----------------------------");
  }
};

export const tags = ["all", "mocks"];
export default deployFunc;

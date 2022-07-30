import { ethers, getNamedAccounts } from "hardhat";

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);

  console.log("Funding Contract.");

  const response = await fundMe.fund({
    value: ethers.utils.parseEther("0.05"),
  });
  await response.wait(1);

  console.log("Funded.");
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log("Err", err);
    process.exit(1);
  });

import { ethers, getNamedAccounts } from "hardhat";

const main = async () => {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);

  console.log("Withdraw Contract.");

  const response = await fundMe.cheaperWithdraw();
  await response.wait(1);

  console.log("Withdraw success.");
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log("Err", err);
    process.exit(1);
  });

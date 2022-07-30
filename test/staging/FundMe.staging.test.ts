import { expect } from "chai";
import { getNamedAccounts, ethers, network } from "hardhat";

import { developmentChains } from "../../helper-hardhat-config";

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async () => {
      let fundMe: any;
      let deployer: any;
      const sendValue = ethers.utils.parseEther("0.05");
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
      });

      it("allows people to fund and withdraw", async () => {
        await fundMe.fund({ value: sendValue });
        await fundMe.withdraw();

        const endingBalance = await fundMe.provider.getBalance(fundMe.address);

        console.log(
          "Ending Fund Me Balance: ",
          endingBalance.toString() + " should equal 0..."
        );

        expect(endingBalance.toString()).to.be.equal("0");
      });
    });

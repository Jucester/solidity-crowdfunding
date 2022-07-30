import { expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";

describe("FundMe", async () => {
  let fundMe: any;
  let deployer: any;
  let mockV3Aggregator: any;
  const sendValue = ethers.utils.parseEther("1");
  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture();
    fundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  describe("constructor", async () => {
    it("sets the aggregator address correctly", async () => {
      const response = await fundMe.getPriceFeed();
      expect(response, mockV3Aggregator.address);
    });
  });

  describe("fund", async () => {
    it("Fails if you dont send enough ETH", async () => {
      await expect(fundMe.fund()).to.be.revertedWith("Didn't send enough");
    });

    it("Update the amount funded data structure", async () => {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.getAddressToAmountFunded(deployer);
      expect(response.toString()).to.equal(sendValue.toString());
    });

    it("Adds funder to array of funders", async () => {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.getFunder(0);
      expect(response).to.be.equal(deployer);
    });
  });

  describe("withdraw", async () => {
    beforeEach(async () => {
      await fundMe.fund({ value: sendValue });
    });

    it("withdraw ETH from a single founder", async () => {
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );

      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer
      );

      const response = await fundMe.cheaperWithdraw();
      const receipt = await response.wait(1);

      const { gasUsed, effectiveGasPrice } = receipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );

      const endingDeployer = await fundMe.provider.getBalance(deployer);

      expect(endingFundMeBalance).to.be.equal(0);
      expect(startingFundMeBalance.add(startingDeployerBalance)).to.be.equal(
        endingDeployer.add(gasCost).toString()
      );
    });

    it("withdraw us to multiples funders", async () => {
      const accounts = await ethers.getSigners();

      for (let i = 1; i < accounts.length; i++) {
        const fundMeConnected = await fundMe.connect(accounts[i]);

        await fundMeConnected.fund({ value: sendValue });
      }

      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );

      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer
      );

      const response = await fundMe.withdraw();
      const receipt = await response.wait(1);

      const { gasUsed, effectiveGasPrice } = receipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );

      const endingDeployer = await fundMe.provider.getBalance(deployer);

      expect(endingFundMeBalance).to.be.equal(0);
      expect(startingFundMeBalance.add(startingDeployerBalance)).to.be.equal(
        endingDeployer.add(gasCost).toString()
      );

      await expect(fundMe.getFunder(0)).to.be.reverted;

      for (let i = 1; i < accounts.length; i++) {
        expect(
          await fundMe.getAddressToAmountFunded(accounts[i].address)
        ).to.be.equal(0);
      }
    });

    it("only allows the owner to withdraw funds", async () => {
      const accounts = await ethers.getSigners();
      const attacker = accounts[1];

      const attackerConnected = await fundMe.connect(attacker);

      // await expect(attackerConnected.withdraw()).to.be.revertedWith(
      //   "FundMe__NotOwner"
      // );

      await expect(attackerConnected.withdraw()).to.be.reverted;
    });
  });
});

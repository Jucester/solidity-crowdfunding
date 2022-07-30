import { run } from "hardhat";

export const verify = async (contractAddress: any, args: any) => {
  console.log("Running verification");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error: any) {
    console.log("Error: ");

    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Already verified");
    } else {
      console.log(error);
    }
  }
};

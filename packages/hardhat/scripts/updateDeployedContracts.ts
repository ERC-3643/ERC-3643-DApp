// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ethers = require("hardhat").ethers;
import path from "path";

export async function updateDeployedContracts(tokenAddress: string): Promise<void> {
  try {
    const token = await ethers.getContractAt("Token", tokenAddress);

    const identityRegistryAddress: string = await token.identityRegistry();
    const complianceAddress: string = await token.compliance();

    const identityRegistry = await ethers.getContractAt("IdentityRegistry", identityRegistryAddress);

    const identityStorageAddress: string = await identityRegistry.identityStorage();
    const issuersRegistryAddress: string = await identityRegistry.issuersRegistry();
    const topicsRegistryAddress: string = await identityRegistry.topicsRegistry();

    const filePath = path.join(__dirname, "../../../packages/nextjs/generated/deployedContracts.ts");
    let fileContent = fs.readFileSync(filePath, "utf8");

    // Construct a mapping of contract names to their new addresses
    const addressMap: { [key: string]: string } = {
      Token: tokenAddress,
      IdentityRegistry: identityRegistryAddress,
      ModularCompliance: complianceAddress,
      IdentityRegistryStorage: identityStorageAddress,
      TrustedIssuersRegistry: issuersRegistryAddress,
      ClaimTopicsRegistry: topicsRegistryAddress,
    };

    // Replace the addresses in the file content
    for (const [contractName, newAddress] of Object.entries(addressMap)) {
      const regex = new RegExp(`(${contractName}: \\{\\s*address: \")([a-zA-Z0-9]{42})`, "g");
      fileContent = fileContent.replace(regex, `$1${newAddress}`);
    }

    // Write the updated content back to `deployedContracts.ts`
    fs.writeFileSync(filePath, fileContent);
    console.log("Updated deployedContracts.ts successfully!");
  } catch (error) {
    console.error("Error updating deployedContracts.ts:", error);
  }
}

// test the function
// updateDeployedContracts("0x0f669b70e99983bbcd4e2c570984fed56df928e0");

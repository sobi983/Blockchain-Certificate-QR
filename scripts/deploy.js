const hre = require("hardhat");

async function main() {


  const certificate = await hre.ethers.getContractFactory("Certification");
  const Certificate = await certificate.deploy();

  await Certificate.deployed();
  console.log(Certificate.address)


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

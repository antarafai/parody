//deploy nft contract
import { ethers } from "hardhat";


async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const VideoNFT = await ethers.getContractFactory("VideoNFT");
    const videoNFT = await VideoNFT.deploy("VideoNFT", "VNFT");
  
    await videoNFT.deployed();
  
    console.log("VideoNFT deployed to:", videoNFT.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
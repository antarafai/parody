import { ethers } from "ethers";
import VideoNFT from "../artifacts/contracts/VideoNFT.sol/VideoNFT.json";
import { Theta } from "@thetalabs/theta-js";

const VIDEO_NFT_ADDRESS = "your_contract_address_here"; // Replace with your contract address

// Function to get a provider or signer
function getProviderOrSigner(needSigner = false) {
  const provider = new ethers.providers.JsonRpcProvider("https://eth-rpc-api.thetatoken.org/rpc");
  if (needSigner) {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    return signer;
  }
  return provider;
}

// Function to mint an NFT
export async function mintNFT(recipient, tokenURI) {
  const signer = getProviderOrSigner(true);
  const videoNFTContract = new ethers.Contract(VIDEO_NFT_ADDRESS, VideoNFT.abi, signer);

  let transaction = await videoNFTContract.mintNFT(recipient, tokenURI);
  await transaction.wait();
}
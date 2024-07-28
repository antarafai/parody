import { ethers } from 'ethers';
import { getProvider } from './thetaWallet';

const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
const CONTRACT_ABI = [
  // Add the ABI of your CoolNFT contract here
];

export const getNFTContract = async () => {
  const provider = getProvider();
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const mintNFT = async (to, tokenId, uri) => {
  const contract = await getNFTContract();
  const tx = await contract.mint(to, tokenId, uri);
  await tx.wait();
  return tx.hash;
};
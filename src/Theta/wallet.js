import WalletConnectProvider from "@walletconnect/client";
import { ethers } from "ethers";

export async function connectWallet() {
  const provider = new WalletConnectProvider({
    rpc: {
      361: "https://eth-rpc-api.thetatoken.org/rpc", // Theta Mainnet
    },
  });

  await provider.enable();
  const ethersProvider = new ethers.providers.Web3Provider(provider);

  return ethersProvider.getSigner();
}

export async function signMessage(signer, message) {
  try {
    const signature = await signer.signMessage(message);
    return signature;
  } catch (error) {
    console.error("Message signing failed:", error);
  }
}
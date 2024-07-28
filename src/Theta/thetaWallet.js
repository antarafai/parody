import { thetajs } from "@thetalabs/theta-js";

let provider;

export const connectWallet = async () => {
  try {
    if (!window.theta) {
      throw new Error("Theta Wallet is not installed");
    }

    provider = new thetajs.providers.ThetaWalletConnect();
    await provider.connect();
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    throw error;
  }
};

export const getWalletAddress = async () => {
  if (!provider) {
    throw new Error("Wallet not connected");
  }
  const accounts = await provider.request({ method: 'eth_accounts' });
  return accounts[0];
};

export const getProvider = () => {
  if (!provider) {
    throw new Error("Wallet not connected");
  }
  return provider;
};
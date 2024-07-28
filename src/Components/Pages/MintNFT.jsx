import React, { useState } from 'react';
import { connectWallet, getWalletAddress } from '../utils/thetaWallet';
import { mintNFT } from '../utils/nftContract';

const NFTMinter = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [tokenURI, setTokenURI] = useState('');
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleMint = async (e) => {
    e.preventDefault();
    setMinting(true);
    try {
      const address = await getWalletAddress();
      const hash = await mintNFT(address, tokenId, tokenURI);
      setTxHash(hash);
    } catch (error) {
      console.error("Failed to mint NFT:", error);
    }
    setMinting(false);
  };

  return (
    <div>
      <h2>NFT Minter</h2>
      {!walletAddress ? (
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      ) : (
        <p>Connected: {walletAddress}</p>
      )}
      <form onSubmit={handleMint}>
        <input
          type="number"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          placeholder="Token ID"
          required
        />
        <input
          type="text"
          value={tokenURI}
          onChange={(e) => setTokenURI(e.target.value)}
          placeholder="Token URI"
          required
        />
        <button type="submit" disabled={minting || !walletAddress}>
          {minting ? 'Minting...' : 'Mint NFT'}
        </button>
      </form>
      {txHash && <p>Transaction Hash: {txHash}</p>}
    </div>
  );
};

export default NFTMinter;
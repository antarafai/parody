// components/MNFTMinter.js
import React, { useState } from 'react';
import { useTheta } from '../../Theta/contexts/ThetaContexts';

export function MNFTMinter() {
  const [metadata, setMetadata] = useState('');
  const { thetaWallet } = useTheta();

  const mintNFT = async () => {
    if (!thetaWallet) return;

    try {
      const result = await thetaWallet.callSmartContract({
        contract: "YOUR_DEPLOYED_CONTRACT_ADDRESS",
        method: "mint",
        args: ["VIDEO_ID", metadata],
        gasPrice: "4000000000000",
        gasLimit: "2000000"
      });

      console.log('NFT minted:', result);
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  return (
    <div>
      <textarea value={metadata} onChange={e => setMetadata(e.target.value)} placeholder="NFT Metadata" />
      <button onClick={mintNFT}>Mint NFT</button>
    </div>
  );
}
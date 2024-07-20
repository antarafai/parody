// react component to mint videos (perhaps a modal)

import React, { useState } from "react";
import { mintNFT } from "./utils/interact";

function App() {
  const [recipient, setRecipient] = useState("");
  const [tokenURI, setTokenURI] = useState("");

  const handleMint = async () => {
    await mintNFT(recipient, tokenURI);
    alert("NFT Minted!");
  };

  return (
    <div>
      <h2>Mint your NFT</h2>
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="text"
        placeholder="Token URI"
        value={tokenURI}
        onChange={(e) => setTokenURI(e.target.value)}
      />
      <button onClick={handleMint}>Mint NFT</button>
    </div>
  );
}

export default App;
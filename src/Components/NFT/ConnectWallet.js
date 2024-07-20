// src/components/ConnectWallet.js
import React, { useState } from 'react';
import { connectWallet, signMessage } from '../utils/wallet';
import axios from 'axios';
import { auth, signInWithCustomToken } from '../firebase'; // Adjust the import path based on your project structure

function ConnectWallet() {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [signature, setSignature] = useState(null);
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    try {
      const signer = await connectWallet();
      setSigner(signer);
      const address = await signer.getAddress();
      setAddress(address);
    } catch (error) {
      setError("Connection failed");
      console.error("Connection failed:", error);
    }
  };

  const handleSignMessage = async () => {
    if (signer) {
      const message = "Please sign this message to authenticate.";
      const signature = await signMessage(signer, message);
      setSignature(signature);

      try {
        const response = await axios.post('https://<your-region>-<your-project-id>.cloudfunctions.net/verifySignature', {
          address,
          message,
          signature
        });

        if (response.data.success) {
          const firebaseToken = response.data.token;
          await signInWithCustomToken(auth, firebaseToken);
          console.log("User authenticated with Firebase");
        } else {
          setError("Signature verification failed");
          console.error("Signature verification failed:", response.data.error);
        }
      } catch (error) {
        setError("Error verifying signature");
        console.error("Error verifying signature:", error);
      }
    }
  };

  return (
    <div>
      {!address ? (
        <button onClick={handleConnect}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected as: {address}</p>
          <button onClick={handleSignMessage}>Sign Message</button>
          {signature && <p>Signature: {signature}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
}

export default ConnectWallet;
// contexts/ThetaContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ThetaWalletConnect from '@thetalabs/theta-wallet-connect';
import { Contract } from '@thetalabs/theta-js';

const ThetaContext = createContext();

const CONTRACT_ADDRESS = 'your_deployed_contract_address';
const VideoMNFTABI = [
    // This would be the ABI of your deployed contract
];

export function ThetaProvider({ children }) {
  const [wallet, setWallet] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initTheta = async () => {
      try {
        const connectedWallet = await ThetaWalletConnect.connect();
        setWallet(connectedWallet);

        const videoMNFTContract = new Contract(CONTRACT_ADDRESS, VideoMNFTABI, connectedWallet);
        setContract(videoMNFTContract);
      } catch (error) {
        console.error('Error initializing Theta:', error);
      }
    };

    initTheta();
  }, []);

  return (
    <ThetaContext.Provider value={{ wallet, contract }}>
      {children}
    </ThetaContext.Provider>
  );
}

ThetaProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useTheta() {
  return useContext(ThetaContext);
}
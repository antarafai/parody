import { useWeb3Modal, createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import React from 'react';
import { ConnectWallet } from '../../App';
import etherLogo from '../../assets/images/etherLogo.png';
import theta from '../../assets/images/theta.png';
import walletconnect from '../../assets/images/walletconnect.png';
import metamask from '../../assets/images/metamask.png';
import coinbase from '../../assets/images/coinbase.png';

const projectId = '6edbdfe6202f9696377b991124957015';

const testnet = {
    chainId: 365,
    name: 'Theta Testnet',
    currency: 'TFUEL',
    explorerUrl: 'https://testnet-explorer.thetatoken.org/',
    rpcUrl: 'https://eth-rpc-api-testnet.thetatoken.org/rpc'
};

const metadata = {
    name: 'Parody',
    description: 'My Website description',
    url: 'https://localhost:3000', // origin must match your domain & subdomain
    icons: ['']
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
    metadata,
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: true,
    rpcUrl: 'https://eth-rpc-api-testnet.thetatoken.org/rpc',
    defaultChainId: 365
});

// 5. Create a Web3Modal instance
createWeb3Modal({
    ethersConfig,
    chains: [testnet],
    projectId,
    enableAnalytics: true,
    defaultChain: testnet
});

const logos = [etherLogo, theta, walletconnect, metamask, coinbase];

function WalletFunctions() {
    const { open } = useWeb3Modal();
    async function handleOpenModal() {
        try {
            await open();
        } catch (error) {
            console.error('Error opening Web3Modal:', error.message);
            console.error('Error details:', error);
        }
    };

    return (
        <div className="flex flex-col" style={{ display:'flex', marginTop: '50px', justifyContent: 'center'}}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom:'-100px'}}>
                <div>
                <ConnectWallet />
                </div>
            </div> 
            
            <button className="font-orbitron" style={{ marginTop: '-150px'}}  onClick={() => open({ view: 'Networks' })}>View Networks</button>

        </div>
    );
};

export default WalletFunctions;
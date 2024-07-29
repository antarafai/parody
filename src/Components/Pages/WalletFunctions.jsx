import { useWeb3Modal, createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'
import React from 'react'
import { ConnectWallet } from '../../App'
import { MintNFT } from './mint-nft'

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
        <div style={{ marginTop: '100px' }}>
            <ConnectWallet />
            <MintNFT />
            <div style={{ marginTop: '40px' }}>
                <button style={{ marginRight: '200px' }} onClick={handleOpenModal}>Open Connect Modal</button>
                <button style={{ marginRight: '200px' }} onClick={() => open({ view: 'Networks' })}>Open Network Modal</button>
            </div>
        </div>
    );
};

export default WalletFunctions;
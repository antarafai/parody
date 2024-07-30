import { http, createConfig } from 'wagmi'
import { base} from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = '6edbdfe6202f9696377b991124957015'

const theta = {
    id: 365,
    name: 'Theta Testnet',
    network: 'theta',
    nativeCurrency: {
      decimals: 18,
      name: 'TFUEL',
      symbol: 'TFUEL',
    },
    rpcUrls: {
      public: { http: ['https://eth-rpc-api-testnet.thetatoken.org/rpc'] },
      default: { http: ['https://eth-rpc-api-testnet.thetatoken.org/rpc'] },
    },
    blockExplorers: {
      etherscan: { name: 'Theta Explorer', url: 'https://testnet-explorer.thetatoken.org/' },
      default: { name: 'Theta Explorer', url: 'https://testnet-explorer.thetatoken.org/' },
    },
  };

export const config = createConfig({
  chains: [theta, base],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
    safe(),
  ],
  transports: {
    [theta.id]: http(),
    [base.id]: http(),
  },
})
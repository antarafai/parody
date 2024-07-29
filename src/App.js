import "./App.css";
import Pages from "./Components/Pages/Pages";
import { BrowserRouter } from "react-router-dom";
import AppContext from "./Components/AppContext/AppContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, useAccount  } from 'wagmi'
import { config } from './wagmi-config'
import { Account } from './Components/Pages/account'
import { WalletOptions } from './Components/Pages/wallet-options'
const queryClient = new QueryClient()

export function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
}

function App() {
  return (

    <div className="App">
      <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
          <BrowserRouter>
            <AppContext>
              <Pages/>
            </AppContext>
          </BrowserRouter>
        </QueryClientProvider>   
      </WagmiProvider>
    </div>
  );
}

export default App;

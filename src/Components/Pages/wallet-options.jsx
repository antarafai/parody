import * as React from 'react';
import { useConnect } from 'wagmi';

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <div className="wallet-options-container">
      {connectors.map((connector) => (
        <WalletOption
          key={connector.uid}
          connector={connector}
          onClick={() => connect({ connector })}
        />
      ))}
    </div>
  );
}

function WalletOption({ connector, onClick }) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <div className="wallet-option">
      <button 
        className="btn btn-outline btn-accent mb-0 h-10 w-40 mx-2 rounded animate-float glow" 
        disabled={!ready} 
        onClick={onClick}
      >
        {connector.name}
      </button>
    </div>
  );
}
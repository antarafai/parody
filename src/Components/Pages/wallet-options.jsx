import * as React from 'react'
import { Connector, useConnect } from 'wagmi'

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return connectors.map((connector) => (
    <WalletOption
      key={connector.uid}
      connector={connector}
      onClick={() => connect({ connector })}
    />
  ));
};

function WalletOption({ connector, onClick }) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    ;(async () => {
      const provider = await connector.getProvider()
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <div style={{marginTop:'50px'}}>
      <button disabled={!ready} onClick={onClick}>
      <div style={{marginRight:'50px'}}> {connector.name} </div>
      </button>
    </div>
  );
};
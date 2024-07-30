import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName })

  return (
    <div>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      Wallet Address:
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
      <button className="font-orbitron" onClick={() => disconnect()}>Disconnect</button>
    </div>
  )
}
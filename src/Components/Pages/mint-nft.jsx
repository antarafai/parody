
import * as React from 'react'
import { 
  useWaitForTransactionReceipt, 
  useWriteContract 
} from 'wagmi'
import { nftABI as abi, contractAddress } from './ABI'
import { GiMonkey } from "react-icons/gi";


const { BigInt } = window; // Import BigInt from the global scope
 
const MintNFT = ({metadataUrl}) =>{
  const { 
    data: hash,
    error,   
    isPending, 
    writeContract 
  } = useWriteContract() 

  async function submit(e) { 
    e.preventDefault() 
    const formData = new FormData(e.target) 
    const tokenId = formData.get('tokenId')
    const mintToAddress = formData.get('mintToAddress')
    writeContract({
      address: contractAddress,
      abi,
      functionName: 'mint',
      args: [mintToAddress, BigInt(tokenId), metadataUrl],
    })
  } 

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 

  return (
    <div>
      <form className="flex flex-col items-center" onSubmit={submit}>
        <input
          className="input input-bordered bg-black text-sm text-accent input-accent w-full max-w-xs"
          name="tokenId"
          placeholder="Token ID"
          required
        />
        <input
          className="input input-bordered bg-black text-sm text-accent input-accent w-full max-w-xs"
          name="mintToAddress"
          placeholder="NFT to this Address"
          required
        />
        <div className="text-yellow-500 font-thin text-xs" style={{ marginTop: '5px' }}>
          Metadata URL: {metadataUrl || "No Metadata Url"}
        </div>
        <button className="btn bg-black btn-circle" style={{ marginTop: '15px' }} disabled={isPending} type="submit">
          <GiMonkey className="h-6 w-6 text-accent" stroke="black">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </GiMonkey>
        </button>
        {isPending ? (
          <div className="text-accent font-thin">Confirming...</div>
        ) : (
          <div></div>
        )}
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div>Error: {error.shortMessage || error.message}</div>
        )}
      </form>
    </div>
  )
}

export default MintNFT
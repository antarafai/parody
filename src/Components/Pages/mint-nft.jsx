
import * as React from 'react'
import { 
  useWaitForTransactionReceipt, 
  useWriteContract 
} from 'wagmi'
import { nftABI as abi, contractAddress } from './ABI'

const { BigInt } = window; // Import BigInt from the global scope
 
export function MintNFT() {
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
    writeContract({
      address: contractAddress,
      abi,
      functionName: 'mint',
      args: ['0xD46D6e2FB31feDCEb74ef8286802ea3d2a8B7D81', BigInt(tokenId), 'https://cyan-glad-chimpanzee-586.mypinata.cloud/ipfs/QmULt7bawkCvdfxaAkpDUa7x1WtDJgZApjb39Ub78tMzFh'],
    })
  } 

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 

  return (
    <form onSubmit={submit}>
      <input name="tokenId" placeholder="Token ID" required />
      {/*<input name="value" placeholder="0.05" required />*/}
      <button 
        disabled={isPending} 
        type="submit"
      >
        {isPending ? 'Confirming...' : 'Mint'} 
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>} 
      {isConfirmed && <div>Transaction confirmed.</div>} 
      {error && ( 
        <div>Error: {(error).shortMessage || error.message}</div> 
      )} 
    </form>
  )
}
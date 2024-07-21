// VideoNFT.js
import { msg, block } from 'hardhat';

class VideoNFT {
    constructor() {
        this.nfts = [];
        this.totalSupply = 0;
    }

    mint(videoId, metadata) {
        this.totalSupply++;
        const nft = {
            tokenId: this.totalSupply,
            videoId: videoId,
            metadata: metadata,
            owner: msg.sender,
            createdAt: block.timestamp
        };
        this.nfts.push(nft);
        return this.totalSupply;
    }

    transfer(to, tokenId) {
        const nft = this.nfts.find(n => n.tokenId === tokenId);
        if (nft && nft.owner === msg.sender) {
            nft.owner = to;
            return true;
        }
        return false;
    }

    getNFT(tokenId) {
        return this.nfts.find(n => n.tokenId === tokenId);
    }
}

export default VideoNFT;
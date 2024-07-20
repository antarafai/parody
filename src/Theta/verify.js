const { ethers } = require('ethers');

function verifySignature(address, message, signature) {
  const recoveredAddress = ethers.utils.verifyMessage(message, signature);
  return recoveredAddress === address;
}

module.exports = { verifySignature };
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { ethers } = require('ethers');

admin.initializeApp();

exports.verifySignature = functions.https.onRequest(async (req, res) => {
  const { address, message, signature } = req.body;

  try {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      const token = await admin.auth().createCustomToken(address);
      res.status(200).send({ success: true, token });
    } else {
      res.status(400).send({ success: false, error: 'Signature verification failed' });
    }
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

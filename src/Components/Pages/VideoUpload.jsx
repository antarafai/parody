import React, { useState } from 'react';

const ThetaEdgeStoreUploader = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [metadataUrl, setMetadataUrl] = useState('');
  const [authToken, setAuthToken] = useState('');

  const generateAuthToken = async (address) => {
    if (!window.ethereum) {
      throw 'wallet not installed';
    }

    const timestamp = Date.now().toString();
    const msg = 'Theta EdgeStore Call ' + timestamp;

    const sig = await window.ethereum.request({
      method: 'personal_sign',
      params: [msg, address],
    });

    const token = `${timestamp}.${address}.${sig}`;
    setAuthToken(token);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://api.thetaedgestore.com/api/v2/data', {
      method: 'POST',
      headers: {
        'x-theta-edgestore-auth': authToken,
      },
      body: formData,
    });

    const data = await response.json();
    return data.key;
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!videoFile) {
      alert('Please select a video file first');
      return;
    }

    // Get the wallet address (you might need to adjust to get the user's wallet address)
    const address = await window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => accounts[0]);

    // Generate the auth token
    await generateAuthToken(address);

    // Upload the video file
    const videoKey = await uploadFile(videoFile);
    const videoUrl = `https://data.thetaedgestore.com/api/v2/data/${videoKey}`;

    // Create metadata JSON
    const metadata = {
      name: 'Your Video Name',
      description: 'Your Video Description',
      image: videoUrl,
    };

    // Convert metadata to Blob
    const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });

    // Upload the metadata JSON file
    const metadataKey = await uploadFile(metadataBlob);
    const metadataFileUrl = `https://data.thetaedgestore.com/api/v2/data/${metadataKey}`;

    // Set the metadata URL state
    setMetadataUrl(metadataFileUrl);
    console.log('Metadata URL:', metadataFileUrl);
  };

  return (
    <div>
      <h1>Upload Video to Theta EdgeStore</h1>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
        />
        <button type="submit">Upload Video</button>
      </form>
      {metadataUrl && (
        <div>
          <h2>Metadata URL</h2>
          <a href={metadataUrl} target="_blank" rel="noopener noreferrer">
            {metadataUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default ThetaEdgeStoreUploader;
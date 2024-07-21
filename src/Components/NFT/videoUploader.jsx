// components/VideoUploader.js
import React, { useState } from 'react';
import { useTheta } from '../contexts/ThetaContext';
import { uploadToThetaVideo } from '../utils/thetaUtils';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

export function VideoUploader() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { wallet } = useTheta();

  const handleUpload = async () => {
    if (!file || !wallet) return;

    try {
      const videoId = await uploadToThetaVideo(file);
      
      // Store video metadata in Firebase
      await addDoc(collection(db, 'videos'), {
        videoId,
        title,
        description,
        uploader: wallet.address,
        uploadedAt: new Date(),
      });

      alert('Video uploaded successfully!');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error uploading video');
    }
  };

  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <button onClick={handleUpload}>Upload Video</button>
    </div>
  );
}

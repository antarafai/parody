import React, { useEffect, useRef, useState } from 'react';
import HlsPlayer from '../VideoPlayer/HlsPlayer';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import PostForm from '../Main/PostForm';

const PreviewModal = ({ onClose, frameCount }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [metadataUrl, setMetadataUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressBar, setProgressBar] = useState(0);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [initialMediaUrl, setInitialMediaUrl] = useState(null); // State to hold initial media URL
  const videoRef = useRef(null);
  const server_url = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const formattedFrameCount = String(frameCount).padStart(4, '0');
        const videoPath = `/home/mizookie/Renders/rendered_animation0001-${formattedFrameCount}.mp4`;

        const response = await fetch(`${server_url}/upload_video`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            video_path: videoPath
          })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Video URL:', data.video_url);
        setVideoUrl(data.video_url);

        // Decode the Base64 encoded video data
        const decodedData = atob(data.encoded_video_data);
        const byteNumbers = new Array(decodedData.length);
        for (let i = 0; i < decodedData.length; i++) {
          byteNumbers[i] = decodedData.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'video/mp4' });
        await uploadBytestream(blob);

      } catch (error) {
        console.error('Error fetching video URL:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoUrl();
  }, [frameCount]);

  const uploadBytestream = async (blob) => {
    const storage = getStorage();
    const uniqueID = new Date().getTime();
    const videoStorageRef = ref(storage, `videos/${uniqueID}.mp4`);
    
    const uploadTask = uploadBytesResumable(videoStorageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgressBar(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("Uploaded firebase URL in PreviewModal:", downloadURL);
        // Create and upload metadata.json file with the video URL
        await uploadMetadata(uniqueID, downloadURL);
      }
    );
  };

  const uploadMetadata = async (uniqueID, firebaseUrl) => {
    const storage = getStorage();
    const metadataStorageRef = ref(storage, `metadata/${uniqueID}.json`);

    const metadata = {
      name: "Video NFT",
      description: "An NFT with a video",
      video: firebaseUrl
    };

    const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });

    const uploadTask = uploadBytesResumable(metadataStorageRef, metadataBlob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgressBar(progress);
      },
      (error) => {
        console.error("Metadata upload failed:", error);
      },
      async () => {
        const metadataDownloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setMetadataUrl(metadataDownloadURL);
        console.log("Uploaded metadata URL:", metadataDownloadURL);
        // Store metadata in Firestore
        await storeMetadataInFirestore(uniqueID, firebaseUrl, metadataDownloadURL);
      }
    );
  };

  const storeMetadataInFirestore = async (uniqueID, videoUrl, metadataUrl) => {
    const db = getFirestore();
    try {
      await addDoc(collection(db, "videos"), {
        id: uniqueID,
        videoUrl: videoUrl,
        metadataUrl: metadataUrl,
        name: "Video NFT",
        description: "An NFT with a video"
      });
      console.log("Metadata stored in Firestore");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handlePostClick = () => {
    setInitialMediaUrl(videoUrl); // Set the video URL as initial media URL for PostForm
    setIsPostFormOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-2xl">
        <h2 className="text-xl mb-4">Preview</h2>
        {loading ? (
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner loading-lg bg-purple-400"></span> {/* DaisyUI loading symbol */}
            <p className="ml-4 text-purple-400">Video uploading...</p>
          </div>
        ) : (
          <HlsPlayer videoUrl={videoUrl} videoRef={videoRef} />
        )}
        {!isPostFormOpen ? (
          <div>
            <button onClick={onClose} className="btn-accent mt-4 p-2 mr-4 bg-blue-500 text-white rounded">Close</button>
            <button onClick={handlePostClick} className="btn-accent mt-4 p-2 mr-4 bg-blue-500 text-white rounded">Post</button>
            <button onClick={onClose} className="btn-accent mt-4 p-2 bg-blue-500 text-white rounded">Download</button>
          </div>
        ) : (
          <PostForm onPostSubmit={() => { setIsPostFormOpen(false); onClose(); }} setProgressBar={setProgressBar} initialMediaUrl={initialMediaUrl} metadataUrl = {metadataUrl} />
        )}
      </div>
    </div>
  );
};

// videoUrl-> initialMediaUrl for PostForm

export default PreviewModal;
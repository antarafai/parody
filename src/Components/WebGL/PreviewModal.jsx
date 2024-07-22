// PreviewModal.jsx
import React, { useEffect, useRef, useState } from 'react';
import HlsPlayer from '../VideoPlayer/HlsPlayer';

const PreviewModal = ({ onClose, frameCount }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const formattedFrameCount = String(frameCount).padStart(4, '0');
        const videoPath = `/home/mizookie/Renders/rendered_animation0001-${formattedFrameCount}.mp4`;

        const response = await fetch('http://localhost:5000/upload_video', {
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
      } catch (error) {
        console.error('Error fetching video URL:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoUrl();
  }, [frameCount]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-2xl">
        <h2 className="text-xl mb-4">Preview</h2>
        {loading ? (
          <div className="flex justify-center items-center">
            <span className="loading loading-spinner loading-lg"></span> {/* DaisyUI loading symbol */}
            <p className="ml-4">Video uploading...</p>
          </div>
        ) : (
          <HlsPlayer videoUrl={videoUrl} videoRef={videoRef} />
        )}
        <button onClick={onClose} className="mt-4 p-2 bg-blue-500 text-white rounded">Close</button>
      </div>
    </div>
  );
};

export default PreviewModal;
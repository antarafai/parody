import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import 'video.js/dist/video-js.css'; // Ensure Video.js CSS is correctly imported

const PreviewModal = ({ onClose, frameCount }) => {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);

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
        const videoUrl = data.video_url;

        initializePlayer(videoUrl);
      } catch (error) {
        console.error('Error fetching video URL:', error);
      } finally {
        setLoading(false);
      }
    };

    const initializePlayer = (videoUrl) => {
      const video = videoRef.current;
      if (!video) return; // Ensure video ref is not null

      let hls;

      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error(`HLS.js error: ${data.type}`, data);
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
        video.addEventListener('canplay', () => {
          video.play();
        });
      }
    };

    fetchVideoUrl();

    return () => {
      if (videoRef.current && Hls.isSupported() && videoRef.current.hls) {
        videoRef.current.hls.destroy();
      }
    };
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
          <div className="relative pb-16x9">
            <video
              ref={videoRef}
              className="video-js vjs-big-play-centered w-full h-full"
              controls
              style={{ width: '100%', height: 'auto' }}
            ></video>
          </div>
        )}
        <button onClick={onClose} className="mt-4 p-2 bg-blue-500 text-white rounded">Close</button>
      </div>
    </div>
  );
};

export default PreviewModal;
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import 'video.js/dist/video-js.css'; // Ensure Video.js CSS is correctly imported

const PreviewModal = ({ onClose }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource('https://media.thetavideoapi.com/srvacc_3z8e4t0g2jkfr57xsz3gqvpj0/video_kzh225ce37vvpsjvpqt8kh8ki5/1631659816016.m3u8');
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error(`HLS.js error: ${data.type}`, data);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = 'https://media.thetavideoapi.com/srvacc_3z8e4t0g2jkfr57xsz3gqvpj0/video_kzh225ce37vvpsjvpqt8kh8ki5/1631659816016.m3u8';
      video.addEventListener('canplay', () => {
        video.play();
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-2xl">
        <h2 className="text-xl mb-4">Preview</h2>
        <div className="relative pb-16x9">
          <video
            ref={videoRef}
            className="video-js vjs-big-play-centered w-full h-full"
            controls
            style={{ width: '100%', height: 'auto' }}
          ></video>
        </div>
        <button onClick={onClose} className="mt-4 p-2 bg-blue-500 text-white rounded">Close</button>
      </div>
    </div>
  );
};

export default PreviewModal;
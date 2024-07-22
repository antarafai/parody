// HlsPlayer.jsx
import React, { useEffect } from 'react';
import Hls from 'hls.js';
import 'video.js/dist/video-js.css'; // Ensure Video.js CSS is correctly imported

const HlsPlayer = ({ videoUrl, videoRef }) => {
  useEffect(() => {
    if (!videoUrl) {
      console.log('No video URL provided');
      return;
    }

    const video = videoRef.current;
    if (!video) {
      console.log('Video element not found');
      return;
    }

    console.log("Initializing player with video URL:", videoUrl);

    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest parsed, starting playback...");
        video.play();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error(`HLS.js error: ${data.type}`, data);
      });

      // Attach HLS instance to video element for cleanup
      video.hls = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      console.log("Using native HLS support...");
      video.src = videoUrl;
      video.addEventListener('canplay', () => {
        console.log("Native HLS can play, starting playback...");
        video.play();
      });
    }

    return () => {
      if (video) {
        if (Hls.isSupported() && video.hls) {
          video.hls.destroy();
        } else {
          video.removeEventListener('canplay', () => {
            console.log("Cleaned up native HLS event listener");
          });
        }
      }
    };
  }, [videoUrl, videoRef]);

  return (
    <div className="relative pb-16x9">
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered w-full h-full"
        controls
        style={{ width: '100%', height: 'auto' }}
      ></video>
    </div>
  );
};

export default HlsPlayer;
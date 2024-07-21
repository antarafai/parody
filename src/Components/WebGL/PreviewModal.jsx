import React, { useState, useEffect } from 'react';

const PreviewModal = ({ onClose }) => {
    const [playVideo, setPlayVideo] = useState(false);

    useEffect(() => {
        const loadScript = (src, onload) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = onload;
            document.body.appendChild(script);
            return script;
        };

        if (playVideo) {
            const scripts = [
                'https://vjs.zencdn.net/7.15.4/video.js',
                'https://cdn.jsdelivr.net/npm/hls.js@0.12.4',
                'https://d1ktbyo67sh8fw.cloudfront.net/js/theta.umd.min.js',
                'https://d1ktbyo67sh8fw.cloudfront.net/js/theta-hls-plugin.umd.min.js',
                'https://d1ktbyo67sh8fw.cloudfront.net/js/videojs-theta-plugin.min.js'
            ];

            let loadCount = 0;
            const scriptElements = [];

            const handleScriptLoad = () => {
                loadCount += 1;
                if (loadCount === scripts.length) {
                    const optionalHlsOpts = null;
                    const optionalThetaOpts = {
                        allowRangeRequests: true,
                    };
                    const player = window.player = window.videojs('my-player', {
                        autoplay: true,
                        muted: false,
                        techOrder: ["theta_hlsjs", "html5"],
                        sources: [{
                            src: "https://media.thetavideoapi.com/org_nbh2rgga2p8g22425pbegwxk1uc6/srvacc_yriv5q2xcaimmhxp0w6jukqw8/video_9kv7d4gxa69dc9b9mggpg5k07c/master.m3u8",
                            type: "application/vnd.apple.mpegurl",
                            label: "1080p"
                        }],
                        theta_hlsjs: {
                            videoId: "a video id",
                            userId: "a user id",
                            onThetaReady: null,
                            onStreamReady: null,
                            hlsOpts: optionalHlsOpts,
                            thetaOpts: optionalThetaOpts,
                        }
                    });
                }
            };

            scripts.forEach(src => {
                scriptElements.push(loadScript(src, handleScriptLoad));
            });

            return () => {
                scriptElements.forEach(script => {
                    document.body.removeChild(script);
                });
            };
        }
    }, [playVideo]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-lg w-3/4 max-w-lg">
                <h2 className="text-xl mb-4">Preview</h2>
                {playVideo ? (
                    <div className="relative pb-16x9">
                        <video id="my-player" className="absolute top-0 left-0 w-full h-full" controls></video>
                    </div>
                ) : (
                    <button onClick={() => setPlayVideo(true)} className="p-2 bg-blue-500 text-white rounded">Play Video</button>
                )}
                <button onClick={onClose} className="mt-4 p-2 bg-blue-500 text-white rounded">Close</button>
            </div>
        </div>
    );
};

export default PreviewModal;
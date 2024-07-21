import React, { useState, useEffect } from 'react';

const PreviewModal = ({ onClose }) => {
    const [playVideo, setPlayVideo] = useState(false);

    useEffect(() => {
        if (playVideo) {
            // Load the Theta video player script
            const script = document.createElement('script');
            script.src = 'https://vjs.zencdn.net/7.15.4/video.js';
            script.onload = () => {
                const hlsScript = document.createElement('script');
                hlsScript.src = 'https://cdn.jsdelivr.net/npm/hls.js@0.12.4';
                hlsScript.onload = () => {
                    const thetaScript = document.createElement('script');
                    thetaScript.src = 'https://d1ktbyo67sh8fw.cloudfront.net/js/theta.umd.min.js';
                    thetaScript.onload = () => {
                        const thetaHlsPluginScript = document.createElement('script');
                        thetaHlsPluginScript.src = 'https://d1ktbyo67sh8fw.cloudfront.net/js/theta-hls-plugin.umd.min.js';
                        thetaHlsPluginScript.onload = () => {
                            const videojsThetaPluginScript = document.createElement('script');
                            videojsThetaPluginScript.src = 'https://d1ktbyo67sh8fw.cloudfront.net/js/videojs-theta-plugin.min.js';
                            videojsThetaPluginScript.onload = () => {
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
                            };
                            document.body.appendChild(videojsThetaPluginScript);
                        };
                        document.body.appendChild(thetaHlsPluginScript);
                    };
                    document.body.appendChild(thetaScript);
                };
                document.body.appendChild(hlsScript);
            };
            document.body.appendChild(script);

            return () => {
                // Cleanup scripts when the modal is closed
                document.body.removeChild(script);
            };
        }
    }, [playVideo]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-xl mb-4">Preview</h2>
                {playVideo ? (
                    <div>
                        <video id="my-player" controls></video>
                    </div>
                ) : (
                    <button onClick={() => setPlayVideo(true)}>Play Video</button>
                )}
                <button onClick={onClose} className="mt-4 p-2 bg-blue-500 text-white rounded">Close</button>
            </div>
        </div>
    );
};

export default PreviewModal;
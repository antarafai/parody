import React, { useState, useEffect } from 'react';

const PreviewModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [playVideo, setPlayVideo] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setPlayVideo(false);
    };

    useEffect(() => {
        if (playVideo && showModal) {
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
                                const player = window.player = videojs('my-player', {
                                    autoplay: true,
                                    muted: false,
                                    techOrder: ["theta_hlsjs", "html5"],
                                    sources: [{
                                        src: "https://media.thetavideoapi.com/srvacc_3z8e4t0g2jkfr57xsz3gqvpj0/video_kzh225ce37vvpsjvpqt8kh8ki5/1631659816016.m3u8",
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
    }, [playVideo, showModal]);

    const handlePlayVideo = () => {
        setPlayVideo(true);
    };

    return (
        <div>
            <button onClick={handleOpenModal}>Open Modal</button>
            {showModal && (
                <div className="modal">
                    {playVideo && (
                        <div>
                            <video id="my-player" controls></video>
                        </div>
                    )}
                    <button onClick={handleCloseModal}>Close Modal</button>
                </div>
            )}
            {showModal && !playVideo && (
                <button onClick={handlePlayVideo}>Play Video</button>
            )}
        </div>
    );
};

export default PreviewModal;
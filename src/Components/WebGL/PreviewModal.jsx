import React, { useState } from 'react';

const PreviewModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [playVideo, setPlayVideo] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlePlayVideo = () => {
        setPlayVideo(true);
    };

    const handlePauseVideo = () => {
        setPlayVideo(false);
    };

    return (
        <div>
            <button onClick={handleOpenModal}>Open Modal</button>
            {showModal && (
                <div className="modal">
                    {playVideo && (
                        <video controls>
                            <source src="/path/to/local/video.mp4" type="video/mp4" />
                        </video>
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
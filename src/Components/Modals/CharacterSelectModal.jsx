import React, { useState, useEffect } from 'react';

const CharacterSelectModal = ({ isOpen, onClose, onSelectCharacter}) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const server_url = 'http://localhost:5000';

  const videos = [
    {
      name: "Female Bot",
      value: "Xbot",
      src: "/character-videos/X-bot-demo.mkv"
    },
    {
      name: "Male Bot",
      value: "Ybot",
      src: "/character-videos/Y-bot-demo.mkv"
    }
  ];
  //onVideo(videos)

  useEffect(() => {
    setSelectedCharacter(videos[currentVideoIndex].value);
  }, [currentVideoIndex]);

  const handleConfirm = async () => {
    if (selectedCharacter) {
      const characterPath = `/home/mizookie/anigen-flask-app/${selectedCharacter}.blend`;
      try {
        const response = await fetch(`${server_url}/config/character`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ character: characterPath }),
        });
        
        if (response.ok) {
          onSelectCharacter(selectedCharacter); // Pass the selected character to the parent
          onClose();
        } else {
          console.error('Error sending POST request:', response.statusText);
        }
      } catch (error) {
        console.error('Error sending POST request:', error);
      }
    } else {
      alert('Please select a video.');
    }
  };

  const handlePrevious = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex === 0 ? videos.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex === videos.length - 1 ? 0 : prevIndex + 1));
  };

  if (!isOpen) return null;

  const currentVideo = videos[currentVideoIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl mb-4 text-center">Select a Character Video</h2>
        <div className="flex justify-center mb-4">
          <label className="block text-center">
            <input
              type="radio"
              name="character"
              value={currentVideo.value}
              onChange={(e) => setSelectedCharacter(e.target.value)}
              checked={selectedCharacter === currentVideo.value}
            />
            {currentVideo.name}
          </label>
        </div>
        <div className="flex flex-col items-center mb-4">
          <video key={currentVideo.src} width="320" height="240" controls>
            <source src={currentVideo.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="flex justify-between mb-4">
          <button onClick={handlePrevious} className="btn btn-secondary">Previous</button>
          <button onClick={handleNext} className="btn btn-secondary">Next</button>
        </div>
        <button
          onClick={handleConfirm}
          className="btn btn-primary w-full"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default CharacterSelectModal;
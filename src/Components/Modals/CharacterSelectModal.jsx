import React, { useState, useEffect } from 'react';

const CharacterSelectModal = ({ isOpen, onClose, onSelectCharacter}) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const server_url = 'https://anigenflas3kzxx1a014-7c9f2efb8947ade2.tec-s1.onthetaedgecloud.com';

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
      <div className="bg-black bg-opacity-25 p-6 rounded-lg w-96">
        <h2 className="text-2xl font-orbitron text-accent mb-4 text-center">Select a Character Video</h2>
        <div className="flex justify-center mb-4">
          <label className="block font-orbitron font-thin text-white text-center">
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
          <button onClick={handlePrevious} className="btn text-accent font-orbitron font-thin bg-neutral btn-outline btn-accent">PREVIOUS</button>
          <button onClick={handleNext} className="btn text-accent font-orbitron font-thin bg-neutral btn-outline btn-accent">NEXT</button>
        </div>
        <button
          onClick={handleConfirm}
          className="btn bg-accent btn-ghost text-black font-orbitron font-bold w-full"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default CharacterSelectModal;
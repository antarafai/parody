import React, { useState } from 'react';

const CharacterSelectModal = ({ isOpen, onClose }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const handleConfirm = async () => {
    if (selectedCharacter) {
      const characterPath = `/home/mizookie/anigen-flask-app/${selectedCharacter}.blend`;
      try {
        const response = await fetch('http://localhost:5000/config/character', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ character: characterPath }),
        });
        
        if (response.ok) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl mb-4">Select a Character Video</h2>
        <div className="mb-4">
          <label className="block mb-2">
            <input
              type="radio"
              name="Female Bot"
              value="Xbot"
              onChange={(e) => setSelectedCharacter(e.target.value)}
            />
            Female Bot
          </label>
          <video width="320" height="240" controls>
            <source src="/character-videos/X-bot-demo.mkv" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            <input
              type="radio"
              name="Male Bot"
              value="Ybot"
              onChange={(e) => setSelectedCharacter(e.target.value)}
            />
            Male Bot
          </label>
          <video width="320" height="240" controls>
            <source src="/character-videos/Y-bot-demo.mkv" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <button
          onClick={handleConfirm}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default CharacterSelectModal;
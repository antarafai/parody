import React from 'react';

const MusicifyModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Musicify Feature</h2>
        <p>Welcome to the Musicify feature!</p>
        <button onClick={onClose} className="btn btn-primary mt-4">Close</button>
      </div>
    </div>
  );
};

export default MusicifyModal;
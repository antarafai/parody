import React from 'react';

const MusicifyWarningModal = ({ onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl text-black mb-4">Musicify is Experimental</h2>
        <p className="text-black">This feature is still under development and may have bugs.</p>
        <div className="flex justify-end mt-4">
          <button onClick={onReject} className="btn btn-error mr-2">Reject</button>
          <button onClick={onAccept} className="btn btn-success">Accept</button>
        </div>
      </div>
    </div>
  );
};

export default MusicifyWarningModal;
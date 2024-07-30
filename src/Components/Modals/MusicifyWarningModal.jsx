import React from 'react';
import { FaExclamation } from "react-icons/fa";

const MusicifyWarningModal = ({ onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-black glow bg-opacity-25 p-4 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex">
        <h2 className="text-xl font-orbitron text-accent mb-4">Musicify is Experimental</h2>
        <FaExclamation className="ml-44 text-red-600 text-2xl mx-auto" />
        </div>
        <p className="text-yellow-500 font-orbitron text-sm">This feature is still under development and may have bugs.</p>
        <div className="flex justify-end mt-4">
          <button onClick={onReject} className="btn bg-red-600 font-orbitron mr-2">REJECT</button>
          <button onClick={onAccept} className="btn btn-accent font-orbitron">ACCEPT</button>
        </div>
      </div>
    </div>
  );
};

export default MusicifyWarningModal;
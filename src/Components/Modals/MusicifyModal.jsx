import React, { useState } from 'react';

/**
 * A modal component for the Musicify feature.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.onClose - The function to be called when the modal is closed.
 * @returns {JSX.Element} The MusicifyModal component.
 */
const MusicifyModal = ({ onClose }) => {
  // State variables
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSample, setSelectedSample] = useState('');

  /**
   * Handles the change event when a file is selected.
   *
   * @param {Object} e - The event object.
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'audio/mpeg' || file.type === 'audio/wav')) {
      setSelectedFile(file);
    } else {
      alert('Please upload a valid MP3 or WAV file.');
    }
  };

  /**
   * Handles the change event when a sample is selected.
   *
   * @param {Object} e - The event object.
   */
  const handleSampleChange = (e) => {
    setSelectedSample(e.target.value);
  };

  // Available samples
  const samples = [
    { name: 'Sample 1', value: 'sample1.mp3' },
    { name: 'Sample 2', value: 'sample2.mp3' },
    { name: 'Sample 3', value: 'sample3.mp3' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl text-black mb-4">Musicify Feature</h2>
        <p className="text-black mb-4">Welcome to the Musicify feature!</p>

        {/* File upload */}
        <div className="mb-4">
          <label className="block text-black mb-2" htmlFor="music-upload">
            Upload Custom Music:
          </label>
          <input
            type="file"
            id="music-upload"
            accept="audio/*"
            className="block w-full text-black"
            onChange={handleFileChange}
          />
          {selectedFile && (
            <p className="text-black mt-2">
              Selected file: {selectedFile.name}
            </p>
          )}
        </div>

        {/* Sample selection */}
        <div className="mb-4">
          <label className="block text-black mb-2" htmlFor="music-samples">
            Choose from Samples:
          </label>
          <select
            id="music-samples"
            className="block w-full text-black"
            value={selectedSample}
            onChange={handleSampleChange}
          >
            <option value="">Select a sample</option>
            {samples.map((sample) => (
              <option key={sample.value} value={sample.value}>
                {sample.name}
              </option>
            ))}
          </select>
          {selectedSample && (
            <p className="text-black mt-2">Selected sample: {selectedSample}</p>
          )}
        </div>

        {/* Close button */}
        <button onClick={onClose} className="btn btn-primary mt-4">
          Close
        </button>
      </div>
    </div>
  );
};

export default MusicifyModal;
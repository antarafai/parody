import React, { useState, useEffect, useRef } from 'react';
import { fetchFileUploadRequest, uploadFile, createLibraryTrack, fetchLibraryTrack } from '../Music/api';

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
  const [audioSrc, setAudioSrc] = useState('');
  const [uploading, setUploading] = useState(false);
  const [samples, setSamples] = useState([
    { name: 'All That', value: 'allthat.mp3', id: '19225501' },
    { name: 'Common Ground', value: 'common-ground.mp3', id: '19225504' },
    { name: 'Keep It Real', value: 'keepitreal.mp3', id: '19225503' },
    { name: 'Private Party', value: 'private-party.mp3', id: '19225502' },
  ]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [audioBase64, setAudioBase64] = useState('');
  const audioRef = useRef(null);
  const server_url = 'http://localhost:5000';

  /**
   * Converts a file to a base64 string.
   *
   * @param {File} file - The file to convert.
   * @returns {Promise<string>} - The base64 encoded string.
   */
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1]; // Remove the data URL prefix
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  /**
   * Handles the change event when a file is selected.
   *
   * @param {Object} e - The event object.
   */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'audio/mpeg' || file.type === 'audio/wav')) {
      setSelectedFile(file);
      setSelectedSample(''); // Clear selected sample
      setAudioSrc(URL.createObjectURL(file));

      try {
        setUploading(true);

        // Convert file to base64
        const base64 = await convertToBase64(file);
        setAudioBase64(base64);

        // Step 1: Request file upload URL
        const { id, uploadUrl } = await fetchFileUploadRequest();
        console.log('Upload ID:', id);
        console.log('Upload URL:', uploadUrl);

        // Step 2: Upload the file
        await uploadFile(uploadUrl, file);
        console.log('File uploaded successfully.');

        // Step 3: Create a library track
        const libraryTrackCreate = await createLibraryTrack(id, file.name);

        if (libraryTrackCreate.__typename === 'LibraryTrackCreateSuccess') {
          const { id: trackId } = libraryTrackCreate.createdLibraryTrack;
          console.log('Library Track Created Successfully. Track ID:', trackId);
          alert(`Library Track Created Successfully. Track ID: ${trackId}`);

          // Add the new track to the samples list
          setSamples((prevSamples) => [
            ...prevSamples,
            { name: file.name, value: file.name, id: trackId },
          ]);
        } else if (libraryTrackCreate.__typename === 'LibraryTrackCreateError') {
          const { code, message } = libraryTrackCreate;
          console.error('Error creating library track:', code, message);
          alert(`Error creating library track: ${message}`);
        } else {
          console.error('Unexpected response:', libraryTrackCreate);
          alert('Unexpected response. Please check the console for more details.');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file. Please try again later.');
      } finally {
        setUploading(false);
      }
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
    const selectedSampleValue = e.target.value;
    setSelectedSample(selectedSampleValue);
    setSelectedFile(null); // Clear selected file
    setAudioSrc(selectedSampleValue ? `/sample-music/${selectedSampleValue}` : '');
  };

  /**
   * Handles the analysis of the track.
   *
   * @param {string} trackId - The ID of the track to analyze.
   */
  const handleAnalyzeTrack = async () => {
    if (!selectedSample && !selectedFile) {
      alert('Please select a sample or upload a file to analyze.');
      return;
    }

    const selectedSampleData = samples.find(sample => sample.value === selectedSample);
    const trackId = selectedSampleData ? selectedSampleData.id : null;

    if (!trackId) {
      alert('Track ID not found for the selected sample.');
      return;
    }

    try {
      const libraryTrack = await fetchLibraryTrack(trackId);

      if (libraryTrack.__typename === 'LibraryTrack') {
        const { genreTags, transformerCaption, moodTags, segments } = libraryTrack.audioAnalysisV6.result;
        const significantTime = segments.representativeSegmentIndex * 15;
        console.log('Genre Tags:', genreTags);
        console.log('Transformer Caption:', transformerCaption);
        console.log('Mood Tags:', moodTags);
        console.log('Significant Time Start:', significantTime);
        alert(`Genre Tags: ${genreTags.join(', ')}\nTransformer Caption: ${transformerCaption}\nMood Tags: ${moodTags.join(', ')}\nSignificant Time Start: ${significantTime}`);

        // Store analysis result in state
        setAnalysisResult({ genreTags, transformerCaption, moodTags, audioBase64 });
      } else if (libraryTrack.__typename === 'LibraryTrackNotFoundError') {
        console.error('Error:', libraryTrack.message);
        alert(`Error: ${libraryTrack.message}`);
      } else {
        console.error('Unexpected response:', libraryTrack);
        alert('Unexpected response. Please check the console for more details.');
      }
    } catch (error) {
      console.error('Error fetching library track:', error);
      alert('Error fetching library track. Please try again later.');
    }
  };

  /**
   * Handles the generation action.
   */
  const handleGenerate = async () => {
    if (!analysisResult) {
      alert('Please analyze a track before generating.');
      return;
    }

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        formData.append('sample', selectedSample);
      }
      formData.append('analysisResult', JSON.stringify(analysisResult));

      const response = await fetch(`${server_url}/generate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('Generate API result:', result);
      alert('Generation request completed successfully.');
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Error generating content. Please try again later.');
    }
  };

  useEffect(() => {
    // Cleanup URL object for the uploaded file
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [selectedFile, audioSrc]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [audioSrc]);

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
            disabled={uploading}
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
            className="block w-full text-white"
            value={selectedSample}
            onChange={handleSampleChange}
          >
            <option value="">Select a sample</option>
            {samples.map((sample) => (
              <option key={sample.value} value={sample.value}>
                {sample.name} (ID: {sample.id})
              </option>
            ))}
          </select>
          {selectedSample && (
            <p className="text-black mt-2">Selected sample: {selectedSample}</p>
          )}
        </div>

        {/* Audio player */}
        {audioSrc && (
          <audio controls className="w-full mt-4" ref={audioRef}>
            <source src={audioSrc} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <button onClick={handleAnalyzeTrack} className="btn btn-secondary mr-2">
            Analyze
          </button>
          <button onClick={handleGenerate} className="btn btn-secondary mr-2">
            Generate
          </button>
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicifyModal;
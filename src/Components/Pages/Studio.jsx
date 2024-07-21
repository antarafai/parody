import React, { useRef, useState, useEffect } from 'react';
import WebGLRenderer from '../WebGL/WebGLRenderer';
import ConfigModal from '../WebGL/ConfigModal';

const server_url = 'http://localhost:5000';

const FBXAnimations = () => {
  const progressBarRef = useRef(null);
  const [modelPaths, setModelPaths] = useState(['/models/Idle.fbx']);
  const [updateFlag, setUpdateFlag] = useState(false); // Ensure re-render

  // Modal logic
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const handleConfigButtonClick = () => {
    setIsConfigModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsConfigModalOpen(false);
  };

  useEffect(() => {
    console.log('Model paths updated:', modelPaths);
  }, [modelPaths]);

  const handleButtonClick = async () => {
    const input = document.getElementById('modelPathsInput');
    console.log('Input value:', input.value);
    const paths = input.value.split(',').map(path => path.trim());
    console.log('Parsed paths:', paths);
    // Prepend the hardcoded path and append prefixes/suffixes
    const updatedPaths = ['/models/Idle.fbx', ...paths.map(path => `/models/Motions/${path}.fbx`)];
    console.log('Updated paths:', updatedPaths);

    try {
      // Define the requests related to motions
      const motionRequest = fetch(`${server_url}/config/motions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motions: paths })
      });

      // Execute the motions request
      const motionResponse = await motionRequest;
      if (!motionResponse.ok) {
        throw new Error(`Request failed with status ${motionResponse.status}`);
      }

      console.log('Motions configuration request successful');
      setModelPaths(updatedPaths);
      setUpdateFlag((prev) => !prev); // Toggle update flag to force re-render

      // Blocking GET request to exec
      const execResponse = await fetch(`${server_url}/exec`);
      if (execResponse.ok) {
        const reader = execResponse.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            console.log(decoder.decode(value));
          }
        }

        console.log('Exec request completed');
      } else {
        console.error('Failed to exec', execResponse.statusText);
      }
    } catch (error) {
      console.error('Error during requests:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row flex-1">
        <div id="sidePanel" className="flex flex-col bg-gray-900 p-4">
          <button 
            id="preConfig" 
            className="btn bg-accent mb-3 rounded h-10 w-40 text-black"
            onClick={handleConfigButtonClick}
          >
            CONFIGURE
          </button>
          <button id="preview" className="btn bg-accent mb-3 rounded h-10 w-40 text-black">PREVIEW</button>
          <button className="bg-gray-600 mb-3 rounded h-10 w-40"></button>
          <button className="bg-gray-600 mb-3 rounded h-10 w-40"></button>
          <button className="bg-gray-600 mb-3 rounded h-10 w-40"></button>
        </div>
        <div className="relative flex-grow h bg-gray-300">
          <WebGLRenderer progressBarRef={progressBarRef} modelPaths={modelPaths} updateFlag={updateFlag} />
          <progress value="0" max="100" id="progressBar" ref={progressBarRef} className="absolute top-2 left-2"></progress>
        </div>
      </div>
      <div id="inputBar" className="flex bg-gray-200 p-2">
        <input
          type="text"
          id="modelPathsInput"
          placeholder="Enter model paths separated by commas"
          className="flex-grow p-2 mr-2 border border-gray-400 rounded"
        />
        <button id="Send" className="p-2 bg-green-500 text-white rounded" onClick={handleButtonClick}>Send</button>
      </div>

      {isConfigModalOpen && (
        <ConfigModal onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default FBXAnimations;
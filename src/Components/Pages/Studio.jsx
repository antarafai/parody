import React, { useRef, useState, useEffect } from 'react';
import WebGLRenderer from '../WebGL/WebGLRenderer';
import ConfigModal from '../WebGL/ConfigModal';

const server_url = 'http://localhost:5000';

const FBXAnimations = () => {
  const progressBarRef = useRef(null);
  const [modelPaths, setModelPaths] = useState(['/models/Idle.fbx']);
  const [updateFlag, setUpdateFlag] = useState(false); // Ensure re-render
  const [isExecInProgress, setIsExecInProgress] = useState(false); // Track exec request status
  const [hasRenderJob, setHasRenderJob] = useState(false); // Track if render job has been given

  // Modal logic
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Alert state
  const [showAlert, setShowAlert] = useState(false);

  const handleConfigButtonClick = () => {
    setIsConfigModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsConfigModalOpen(false);
  };

  useEffect(() => {
    console.log('Model paths updated:', modelPaths);
  }, [modelPaths]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleButtonClick = async () => {
    const input = document.getElementById('modelPathsInput');
    console.log('Input value:', input.value);
    const paths = input.value.split(',').map(path => path.trim());
    console.log('Parsed paths:', paths);
    // Prepend the hardcoded path and append prefixes/suffixes
    const updatedPaths = ['/models/Idle.fbx', ...paths.map(path => `/models/Motions/${path}.fbx`)];
    console.log('Updated paths:', updatedPaths);

    try {
      // Set exec in progress to true
      setIsExecInProgress(true);
      setHasRenderJob(true); // Indicate that a render job has been given

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
    } finally {
      // Set exec in progress to false
      setIsExecInProgress(false);
    }
  };

  const handlePreviewClick = () => {
    if (isExecInProgress) {
      setShowAlert(true);
    } else if (!hasRenderJob) {
      setShowAlert(true);
    } else {
      // Handle the actual preview functionality here
      console.log('Preview button clicked');
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
          <button 
            id="preview" 
            className={`btn ${hasRenderJob ? (isExecInProgress ? 'bg-gray-500' : 'bg-accent') : 'bg-red-500'} mb-3 rounded h-10 w-40 text-black`}
            onClick={handlePreviewClick}
          >
            PREVIEW
          </button>
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

      {showAlert && (
        <div className="fixed top-4 right-4 p-4 bg-yellow-500 text-black rounded-xl shadow-lg flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {isExecInProgress ? (
            <span>Video rendering is still in progress</span>
          ) : (
            <span>No rendering job has been given</span>
          )}
        </div>
      )}
    </div>
  );
};

export default FBXAnimations;
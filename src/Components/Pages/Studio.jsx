import React, { useRef, useState } from 'react';
import WebGLRenderer from '../WebGL/WebGLRenderer';

const server_url = 'http://localhost:5000';

const FBXAnimations = () => {
  const progressBarRef = useRef(null);
  const [modelPaths, setModelPaths] = useState([
    '/models/Motions/idle_looking_over_both_shoulders.fbx'
  ]);

  const handleButtonClick = async () => {
    const input = document.getElementById('modelPathsInput');
    console.log('Input value:', input.value);
    const paths = input.value.split(',').map(path => path.trim());
    console.log('Parsed paths:', paths);
    // Prepend the hardcoded path and append prefixes/suffixes
    const updatedPaths = paths.map(path => `/models/Motions/${path}.fbx`);
    console.log('Updated paths:', updatedPaths);

    try {
      // Define the requests in sequence
      const requests = [
        fetch(`${server_url}/config/reset`, { method: 'POST' }),
        fetch(`${server_url}/config/motions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ motions: paths })
        }),
        fetch(`${server_url}/config/character`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ character: "/home/mizookie/anigen-flask-app/Ybot.blend" })
        }),
        fetch(`${server_url}/config/frames`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ total_frames: 50 })
        }),
        fetch(`${server_url}/config/import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ import_path: "/home/mizookie/Motions/Motions/Motions" })
        }),
        fetch(`${server_url}/config/render`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ render_path: "/home/mizookie/Renders" })
        })
      ];

      // Execute the requests sequentially
      for (const request of requests) {
        const response = await request;
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
      }

      console.log('All configuration requests successful');
      setModelPaths(updatedPaths);

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
        <div id="sidePanel" className="flex flex-col bg-gray-600 p-2 w-16">
          <button className="bg-green-500 mb-2 rounded h-10 w-10"></button>
          <button className="bg-green-500 mb-2 rounded h-10 w-10"></button>
          <button className="bg-green-500 mb-2 rounded h-10 w-10"></button>
          <button className="bg-green-500 mb-2 rounded h-10 w-10"></button>
          <button className="bg-green-500 mb-2 rounded h-10 w-10"></button>
        </div>
        <div className="relative flex-grow h bg-gray-300">
          <WebGLRenderer progressBarRef={progressBarRef} modelPaths={modelPaths} />
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
    </div>
  );
};

export default FBXAnimations;
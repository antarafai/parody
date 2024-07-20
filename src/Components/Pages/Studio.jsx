import React, { useRef } from 'react';
import WebGLRenderer from '../WebGL/WebGLRenderer';

const FBXAnimations = () => {
  const progressBarRef = useRef(null);
  const modelPaths = [
    '/models/Y-Bot-T-pose.fbx',
    '/models/Joyful-Jump.fbx',
    '/models/Slide-Hip-Hop-Dance.fbx',
    '/models/Shoved-Reaction-With-Spin.fbx'
  ];

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
      <div className="flex bg-gray-200 p-2">
        <input type="text" placeholder="Enter command" className="flex-grow p-2 mr-2 border border-gray-400 rounded" />
        <button className="p-2 bg-green-500 text-white rounded">Send</button>
      </div>
    </div>
  );
};

export default FBXAnimations;
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const DesignerStudio = () => {
  const webGLRef = useRef(null); // Ref for the div where the WebGL will be rendered

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    webGLRef.current.appendChild(renderer.domElement); // Attach renderer to the DOM

    // Add objects to the scene
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    // Animation loop
    const animate = function () {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on component unmount
    return () => {
      webGLRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <header className="text-center py-4 bg-gray-800 text-white">
        <h1 className="text-2xl font-bold">Designer Studio</h1>
      </header>
      <div className="flex flex-1">
        {/* Toolbar */}
        <div className="w-16 bg-gray-200 flex flex-col items-center p-2 space-y-4 fixed h-full">
          <button className="w-12 h-12 bg-green-500 rounded"></button>
          <button className="w-12 h-12 bg-green-500 rounded"></button>
          <button className="w-12 h-12 bg-green-500 rounded"></button>
          <button className="w-12 h-12 bg-green-500 rounded"></button>
          <button className="w-12 h-12 bg-green-500 rounded"></button>
        </div>
        {/* Main Content */}
        <div className="flex-1 ml-16 p-4">
          {/* WebGL viewport */}
          <div className="bg-gray-300 flex-1 flex items-center justify-center" ref={webGLRef}></div>
          {/* Prompt Bar */}
          <div className="flex items-center mt-4">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-l"
              placeholder="Enter your prompt here..."
            />
            <button className="w-16 bg-green-500 text-white rounded-r p-2">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerStudio;
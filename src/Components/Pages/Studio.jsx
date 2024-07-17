import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const DesignerStudio = () => {
  const webGLRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    webGLRef.current.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Add a simple cube for reference
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 1, 0);
    scene.add(cube);

    // Load FBX model
    const loader = new FBXLoader();
    loader.load('/path/to/your/model.fbx', (object) => {
      object.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(object);
    });

    camera.position.set(0, 5, 10);
    controls.update();

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize, false);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', onWindowResize);
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
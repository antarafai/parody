import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';

const DesignerStudio = () => {
  const webGLRef = useRef(null);
  const progressBarRef = useRef(null);
  const [mixer, setMixer] = useState(null);
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    webGLRef.current.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = true;
    controls.target.set(0, 1, 0);

    // Axes helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(2.5, 7.5, 15);
    scene.add(light);

    // Camera position
    camera.position.set(0.8, 1.4, 1.0);

    // Stats
    const stats = new Stats();
    document.body.appendChild(stats.dom);

    // GUI
    const gui = new GUI();
    const animationsFolder = gui.addFolder('Animations');
    animationsFolder.open();

    // Load glTF models and animations
    const gltfLoader = new GLTFLoader();
    const loadModel = async (url) => {
      try {
        return await new Promise((resolve, reject) => {
          gltfLoader.load(url, resolve, undefined, reject);
        });
      } catch (error) {
        console.error(`Error loading ${url}`, error);
        throw error;
      }
    };

    const loadModels = async () => {
      try {
        const mainModel = await loadModel('/models/vanguard_t_choonyung.glb');
        console.log('Loaded main model', mainModel);
        mainModel.scene.scale.set(0.01, 0.01, 0.01);
        setMixer(new THREE.AnimationMixer(mainModel.scene));
        scene.add(mainModel.scene);

        const samba = await loadModel('/models/vanguard_samba.glb');
        console.log('Loaded samba animation', samba);

        const bellydance = await loadModel('/models/vanguard_bellydance.glb');
        console.log('Loaded bellydance animation', bellydance);

        const goofyrunning = await loadModel('/models/vanguard_goofyrunning.glb');
        console.log('Loaded goofyrunning animation', goofyrunning);

        progressBarRef.current.style.display = 'none';
        setModelReady(true);
      } catch (error) {
        console.error('Error loading one of the models', error);
      }
    };

    loadModels();

    // Window resize handler
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    };
    window.addEventListener('resize', onWindowResize, false);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      if (modelReady && mixer) mixer.update(clock.getDelta());
      render();
      stats.update();
    };

    const render = () => {
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', onWindowResize);
      webGLRef.current.removeChild(renderer.domElement);
      document.body.removeChild(stats.dom);
      gui.destroy();
    };
  }, [modelReady, mixer]);

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
          <progress value="0" max="100" id="progressBar" ref={progressBarRef}></progress>
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
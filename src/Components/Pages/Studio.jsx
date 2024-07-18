import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';

const DesignerStudio = () => {
  const webGLRef = useRef(null);
  const progressBarRef = useRef(null);
  const [animations, setAnimations] = useState({});
  const [mixer, setMixer] = useState(null);
  const [modelReady, setModelReady] = useState(false);
  const [animationActions, setAnimationActions] = useState([]);
  const [activeAction, setActiveAction] = useState(null);
  const [lastAction, setLastAction] = useState(null);

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

    // Load FBX models and animations
    const fbxLoader = new FBXLoader();
    const loadModel = (url, onLoad, onProgress) => {
      fbxLoader.load(url, onLoad, onProgress, (error) => {
        console.error(`Error loading ${url}`, error);
      });
    };

    function checkFileExists(filePath) {
      return new Promise((resolve, reject) => {
        fetch(filePath)
          .then(response => {
            resolve(response.ok);
          })
          .catch(error => {
            reject(error);
          });
      });
    }

    // Load FBX models and animations
    checkFileExists('public/models/Y-Bot-T-pose.fbx')
    .then(fileExists => {
      if (fileExists) {
        // File exists, load the model
        console.log('File exists.');
      } else {
        console.log('File does not exist.');
      }
    })
          // File exists, load the model
    loadModel(
      'public/models/Y-Bot-T-pose.fbx',
      (object) => {
        object.scale.set(0.01, 0.01, 0.01);
        const mixerInstance = new THREE.AnimationMixer(object);
        setMixer(mixerInstance);
        const animationAction = mixerInstance.clipAction(object.animations[0]);
        setAnimationActions((prevActions) => [...prevActions, animationAction]);
        animationsFolder.add(animations, 'default');
        console.log("Default animation loaded");
        setActiveAction(animationActions[0]);
        scene.add(object);

        loadModel(
          'public/models/Slide-Hip-Hop-Dance.fbx',
          (object) => {
            const animationAction = mixerInstance.clipAction(object.animations[0]);
            setAnimationActions((prevActions) => [...prevActions, animationAction]);
            animationsFolder.add(animations, 'dance');
            console.log("Dance animation loaded");

            loadModel(
              'public/models/Shoved-Reaction-With-Spin.fbx',
              (object) => {
                const animationAction = mixerInstance.clipAction(object.animations[0]);
                setAnimationActions((prevActions) => [...prevActions, animationAction]);
                animationsFolder.add(animations, 'reaction');
                console.log("Reaction animation loaded");

                loadModel(
                  'public/models/Joyful-Jump.fbx',
                  (object) => {
                    object.animations[0].tracks.shift();
                    const animationAction = mixerInstance.clipAction(object.animations[0]);
                    setAnimationActions((prevActions) => [...prevActions, animationAction]);
                    animationsFolder.add(animations, 'jumping');
                    console.log("Jumping animation loaded");
                    progressBarRef.current.style.display = 'none';
                    setModelReady(true);
                  },
                  (xhr) => {
                    if (xhr.lengthComputable) {
                      const percentComplete = (xhr.loaded / xhr.total) * 100;
                      progressBarRef.current.value = percentComplete;
                      progressBarRef.current.style.display = 'block';
                    }
                  },
                  (error) => {
                    console.log(error);
                  }
                );
              },
              (xhr) => {
                if (xhr.lengthComputable) {
                  const percentComplete = (xhr.loaded / xhr.total) * 100;
                  progressBarRef.current.value = percentComplete;
                  progressBarRef.current.style.display = 'block';
                }
              },
              (error) => {
                console.log(error);
              }
            );
          },
          (xhr) => {
            if (xhr.lengthComputable) {
              const percentComplete = (xhr.loaded / xhr.total) * 100;
              progressBarRef.current.value = percentComplete;
              progressBarRef.current.style.display = 'block';
            }
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total) * 100;
          progressBarRef.current.value = percentComplete;
          progressBarRef.current.style.display = 'block';
        }
      },
      (error) => {
        console.log(error);
      }
    );

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
  }, [modelReady, mixer, animationActions, animations]);

  const setAction = (toAction) => {
    if (toAction !== activeAction && activeAction) {
      lastAction.fadeOut(1);
      toAction.reset();
      toAction.fadeIn(1);
      toAction.play();
    }
    setLastAction(activeAction);
    setActiveAction(toAction);
  };

  useEffect(() => {
    if (animationActions.length > 0) {
      setAnimations({
        default: () => setAction(animationActions[0]),
        dance: () => setAction(animationActions[1]),
        reaction: () => setAction(animationActions[2]),
        jumping: () => setAction(animationActions[3]),
      });
    }
  }, [animationActions]);

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
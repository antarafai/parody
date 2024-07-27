import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { useState } from 'react';

const WebGLRenderer = ({ progressBarRef, modelPaths }) => {
  const mountRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;

    // Flash logic
    const flashInterval = setInterval(() => {
      const flashElement = document.createElement("div");
      flashElement.className = "flash-animation";
      mountRef.current.appendChild(flashElement);
      playing ? mountRef.current.removeChild(flashElement) : mountRef.current.appendChild(flashElement);


      setTimeout(() => {
        mountRef.current.removeChild(flashElement);
      }, 1000); // Flash duration
    }, 3000); // Flash interval

    // Scene setup
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5));
    // Light setup
    const whiteSpotlight = new THREE.PointLight(0xffffff, 800);
    whiteSpotlight.position.set(2.5, 7.5, 15);
    scene.add(whiteSpotlight);

    // Purple spotlight
    const pinkSpotlight = new THREE.SpotLight(0xff66cc, 200);
    pinkSpotlight.position.set(-5, 5, 5);
    pinkSpotlight.target.position.set(0, 0, 0);
    scene.add(pinkSpotlight);
    scene.add(pinkSpotlight.target);

    const yellowSpotlight = new THREE.SpotLight(0xffff00, 200);
    yellowSpotlight.position.set(5, 5, -5);
    yellowSpotlight.target.position.set(0, 0, 0);
    scene.add(yellowSpotlight);
    scene.add(yellowSpotlight.target);

    // Animation loop for moving the target of the spotlights
    const animateSpotlightTargets = () => {
      const time = Date.now() * 0.002; // Increase the time factor to make the animation faster

      // Calculate the new target position for the pink spotlight
      const pinkTargetX = Math.sin(time) * 5;
      const pinkTargetY = Math.cos(time) * 5;
      const pinkTargetZ = Math.sin(time) * Math.cos(time) * 10;
      const pinkTargetPosition = new THREE.Vector3(pinkTargetX, pinkTargetY, pinkTargetZ);
      pinkSpotlight.target.position.lerp(pinkTargetPosition, 0.05); // Smoothly interpolate the position

      // Calculate the new target position for the yellow spotlight
      const yellowTargetX = Math.cos(time) * 5;
      const yellowTargetY = Math.sin(time) * 5;
      const yellowTargetZ = Math.cos(time) * Math.sin(time) * 10;
      const yellowTargetPosition = new THREE.Vector3(yellowTargetX, yellowTargetY, yellowTargetZ);
      yellowSpotlight.target.position.lerp(yellowTargetPosition, 0.05); // Smoothly interpolate the position

      // Call the animation loop recursively
      requestAnimationFrame(animateSpotlightTargets);
    };

    // Start the animation loop for moving the spotlight targets
    animateSpotlightTargets();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0.8, 1.4, 1.0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = true;
    controls.target.set(0, 1, 0);

    let mixer;
    let modelReady = false;
    let animationActions = [];
    let activeAction;

    const fbxLoader = new FBXLoader();
    const textureLoader = new THREE.TextureLoader();

    // Function to load models and animations sequentially
    const loadModel = (path, onComplete, onProgress, onError) => {
      fbxLoader.load(path, onComplete, onProgress, onError);
    };

    const onProgress = (xhr) => {
      if (xhr.lengthComputable) {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        progressBarRef.current.value = percentComplete;
        progressBarRef.current.style.display = 'block';
      }
    };

    const onError = (error) => {
      console.error(error);
    };

    const loadAnimations = (paths, index = 0) => {
      if (index >= paths.length) {
        progressBarRef.current.style.display = 'none';
        modelReady = true;
        playSequentialAnimations();
        return;
      }

      loadModel(
        paths[index],
        (object) => {
          if (index === 0) {
            object.scale.set(0.01, 0.01, 0.01);
            mixer = new THREE.AnimationMixer(object);
            scene.add(object);

            // Ensure materials are correctly assigned
            object.traverse((child) => {
              if (child.isMesh) {
                const materialArray = Array.isArray(child.material) ? child.material : [child.material];
                materialArray.forEach((material) => {
                  if (material.map) {
                    const texturePath = material.map.sourceFile;
                    material.map = textureLoader.load(texturePath);
                  }
                });
              }
            });
          } else {
            if (index === paths.length - 1) {
              object.animations[0].tracks.shift(); // Adjust for the last animation
            }
          }
          const animationAction = mixer.clipAction(object.animations[0]);
          animationActions.push(animationAction);

          console.log(`Loaded animation ${index + 1}:`, object.animations[0]);
          console.log(`Animation ${index + 1} duration: ${object.animations[0].duration}s`);

          if (index === 0) {
            activeAction = animationActions[0];
          }
          loadAnimations(paths, index + 1);
        },
        onProgress,
        onError
      );
    };

    loadAnimations(modelPaths);

    // Resize the renderer when the window is resized
    const onWindowResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      render();
    };

    window.addEventListener('resize', onWindowResize, false);

    // Set the active animation action
    const setAction = (toAction) => {
      if (toAction !== activeAction) {
        const lastAction = activeAction;
        activeAction = toAction;
        if (lastAction) lastAction.fadeOut(0.5); // Smooth transition
        activeAction.reset().fadeIn(0.5).play(); // Smooth transition and play the new action
      }
    };

    // Play animations in sequence
    const playSequentialAnimations = () => {
      if (animationActions.length > 0) {
        let currentAnimationIndex = 0;

        const playNextAnimation = () => {
          if (currentAnimationIndex < animationActions.length) {
            setPlaying(true);
            setAction(animationActions[currentAnimationIndex]);
            activeAction.play();

            console.log(`Playing animation ${currentAnimationIndex + 1}`);
    
            // Determine the duration to wait before playing the next animation
            let duration;
            if (currentAnimationIndex === 0) {
              // Fixed duration of 2 seconds for the first animation
              duration = 2000;
            } else {
              // Use the animation clip's own duration for subsequent animations
              duration = activeAction.getClip().duration * 1000; // Convert duration to milliseconds
            }
    
            setTimeout(() => {
              console.log(`Finished animation ${currentAnimationIndex + 1}`);
              currentAnimationIndex++;
              if (currentAnimationIndex < animationActions.length) {
                playNextAnimation();
              }
              else {
                setPlaying(false);
              }
            }, duration);
          }
        };
    
        playNextAnimation();
      }
    };

    const clock = new THREE.Clock();

    // Animate the scene on each frame
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      if (modelReady) mixer.update(clock.getDelta());
      render();
    };

    const render = () => {
      renderer.render(scene, camera);
    };

    animate();

    // Clean up the scene when the component unmounts
    return () => {
      window.removeEventListener('resize', onWindowResize);
      clearInterval(flashInterval);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [progressBarRef, modelPaths]);

  return (
    <div
      ref={mountRef}
      className="w-[800px] h-[600px] rounded overflow-hidden mx-auto p-0 relative bg-gray-100 mt-8"
    >
      {/* Top left corner */}
      <div className="border-animation absolute top-0 left-0 w-6 h-0.5 bg-yellow-500"></div>
      <div className="border-animation absolute top-0 left-0 w-0.5 h-6 bg-yellow-500"></div>

      {/* Top right corner */}
      <div className="border-animation absolute top-0 right-0 w-6 h-0.5 bg-yellow-500"></div>
      <div className="border-animation absolute top-0 right-0 w-0.5 h-6 bg-yellow-500"></div>

      {/* Bottom left corner */}
      <div className="border-animation absolute bottom-0 left-0 w-6 h-0.5 bg-yellow-500"></div>
      <div className="border-animation absolute bottom-0 left-0 w-0.5 h-6 bg-yellow-500"></div>

      {/* Bottom right corner */}
      <div className="border-animation absolute bottom-0 right-0 w-6 h-0.5 bg-yellow-500"></div>
      <div className="border-animation absolute bottom-0 right-0 w-0.5 h-6 bg-yellow-500"></div>

      <style jsx>{`
        @keyframes focusInOut {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(4);
          }
        }
        .border-animation {
          animation: focusInOut 2s infinite;
        }
        
        .flash-animation {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: rgba(255, 255, 0, 0.5);
          transform: rotate(45deg);
          animation: flash 0.5s forwards;
        }
        @keyframes flash {
          0% {
            opacity: 0;
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          50% {
            opacity: 1;
            transform: translateX(0) translateY(0) rotate(45deg);
          }
          100% {
            opacity: 0;
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }
      `}</style>
    </div>
  );
};

export default WebGLRenderer;
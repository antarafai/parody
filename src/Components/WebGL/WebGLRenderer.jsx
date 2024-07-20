import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const WebGLRenderer = ({ progressBarRef, modelPaths }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5));

    // Light setup
    const light = new THREE.PointLight(0xffffff, 1000);
    light.position.set(2.5, 7.5, 15);
    scene.add(light);

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
            setAction(animationActions[currentAnimationIndex]);
            activeAction.play();

            console.log(`Playing animation ${currentAnimationIndex + 1}`);

            // Transition to the next animation after the current one's duration
            setTimeout(() => {
              console.log(`Finished animation ${currentAnimationIndex + 1}`);
              currentAnimationIndex++;
              if (currentAnimationIndex < animationActions.length) {
                playNextAnimation();
              }
            }, activeAction.getClip().duration * 1000); // Convert duration to milliseconds
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
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [progressBarRef, modelPaths]);

  return (
    <div
      ref={mountRef}
      className="w-[800px] h-[600px] overflow-hidden mx-auto p-0 border border-gray-300"
    />
  );
};

export default WebGLRenderer;
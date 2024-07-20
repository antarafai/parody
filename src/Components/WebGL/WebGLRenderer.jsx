import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const WebGLRenderer = ({ progressBarRef }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const light = new THREE.PointLight(0xffffff, 1000);
    light.position.set(2.5, 7.5, 15);
    scene.add(light);

    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0.8, 1.4, 1.0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = true;
    controls.target.set(0, 1, 0);

    let mixer;
    let modelReady = false;
    let animationActions = [];
    let activeAction;
    let lastAction;

    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      '/models/Y-Bot-T-pose.fbx',
      (object) => {
        object.scale.set(0.01, 0.01, 0.01);
        mixer = new THREE.AnimationMixer(object);
        let animationAction = mixer.clipAction(object.animations[0]);
        animationActions.push(animationAction);
        activeAction = animationActions[0];
        scene.add(object);

        fbxLoader.load(
          '/models/Joyful-Jump.fbx',
          (object) => {
            let animationAction = mixer.clipAction(object.animations[0]);
            animationActions.push(animationAction);

            fbxLoader.load(
              '/models/Slide-Hip-Hop-Dance.fbx',
              (object) => {
                let animationAction = mixer.clipAction(object.animations[0]);
                animationActions.push(animationAction);

                fbxLoader.load(
                  '/models/Shoved-Reaction-With-Spin.fbx',
                  (object) => {
                    object.animations[0].tracks.shift();
                    let animationAction = mixer.clipAction(object.animations[0]);
                    animationActions.push(animationAction);
                    progressBarRef.current.style.display = 'none';
                    modelReady = true;
                  },
                  (xhr) => {
                    if (xhr.lengthComputable) {
                      var percentComplete = (xhr.loaded / xhr.total) * 100;
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
                  var percentComplete = (xhr.loaded / xhr.total) * 100;
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
              var percentComplete = (xhr.loaded / xhr.total) * 100;
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
          var percentComplete = (xhr.loaded / xhr.total) * 100;
          progressBarRef.current.value = percentComplete;
          progressBarRef.current.style.display = 'block';
        }
      },
      (error) => {
        console.log(error);
      }
    );

    function onWindowResize() {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      render();
    }

    window.addEventListener('resize', onWindowResize, false);

    const setAction = (toAction) => {
      if (toAction !== activeAction) {
        lastAction = activeAction;
        activeAction = toAction;
        if (lastAction) lastAction.fadeOut(1);
        activeAction.reset();
        activeAction.fadeIn(1);
        activeAction.play();
      }
    };

    const handleClick = () => {
      if (modelReady) {
        const nextActionIndex = (animationActions.indexOf(activeAction) + 1) % animationActions.length;
        setAction(animationActions[nextActionIndex]);
      }
    };

    mount.addEventListener('click', handleClick);

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      if (modelReady) mixer.update(clock.getDelta());
      render();
    }

    function render() {
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      mount.removeEventListener('click', handleClick);
      mount.removeChild(renderer.domElement);
    };
  }, [progressBarRef]);

  return (
    <div
      ref={mountRef}
      className="w-[800px] h-[600px] overflow-hidden mx-auto p-0"
    />
  );
};

export default WebGLRenderer;
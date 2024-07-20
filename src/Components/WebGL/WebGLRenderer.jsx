import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';

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
        animationsFolder.add(animations, 'default');
        activeAction = animationActions[0];
        scene.add(object);

        fbxLoader.load(
          '/models/Joyful-Jump.fbx',
          (object) => {
            let animationAction = mixer.clipAction(object.animations[0]);
            animationActions.push(animationAction);
            animationsFolder.add(animations, 'samba');

            fbxLoader.load(
              '/models/Slide-Hip-Hop-Dance.fbx',
              (object) => {
                let animationAction = mixer.clipAction(object.animations[0]);
                animationActions.push(animationAction);
                animationsFolder.add(animations, 'bellydance');

                fbxLoader.load(
                  '/models/Shoved-Reaction-With-Spin.fbx',
                  (object) => {
                    object.animations[0].tracks.shift();
                    let animationAction = mixer.clipAction(object.animations[0]);
                    animationActions.push(animationAction);
                    animationsFolder.add(animations, 'goofyrunning');
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

    const stats = new Stats();
    document.body.appendChild(stats.dom);

    var animations = {
      default: function () {
        setAction(animationActions[0]);
      },
      samba: function () {
        setAction(animationActions[1]);
      },
      bellydance: function () {
        setAction(animationActions[2]);
      },
      goofyrunning: function () {
        setAction(animationActions[3]);
      },
    };

    const setAction = (toAction) => {
      if (toAction !== activeAction) {
        lastAction = activeAction;
        activeAction = toAction;
        lastAction.fadeOut(1);
        activeAction.reset();
        activeAction.fadeIn(1);
        activeAction.play();
      }
    };

    const gui = new GUI();
    const animationsFolder = gui.addFolder('Animations');
    animationsFolder.open();

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      if (modelReady) mixer.update(clock.getDelta());
      render();
      stats.update();
    }

    function render() {
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      mount.removeChild(renderer.domElement);
      document.body.removeChild(stats.dom);
    };
  }, [progressBarRef]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '800px', // Set your desired width
        height: '600px', // Set your desired height
        overflow: 'hidden',
        margin: '0 auto', // Center the container
        padding: 0,
        border: '1px solid #ccc', // Optional border to visualize the container
      }}
    />
  );
};

export default WebGLRenderer;
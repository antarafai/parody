import React, { useRef, useState, useEffect } from 'react';
import WebGLRenderer from '../WebGL/WebGLRenderer';
import ConfigModal from '../WebGL/ConfigModal';
import PreviewModal from '../WebGL/PreviewModal';
import CharacterSelectModal from '../Modals/CharacterSelectModal'; // Import the CharacterSelectModal
import runPrompt from '../NLP/Prompt';

const server_url = 'http://localhost:5000';

const FBXAnimations = () => {
    const progressBarRef = useRef(null);
    const [modelPaths, setModelPaths] = useState(['/models/Idle.fbx']);
    const [updateFlag, setUpdateFlag] = useState(false); // Ensure re-render
    const [isExecInProgress, setIsExecInProgress] = useState(false); // Track exec request status
    const [hasRenderJob, setHasRenderJob] = useState(false); // Track if render job has been given

    // Modal logic
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false); // State for preview modal
    const [isCharacterSelectModalOpen, setIsCharacterSelectModalOpen] = useState(false); // State for character select modal

    // Alert state
    const [showAlert, setShowAlert] = useState(false);
    const [renderProgress, setRenderProgress] = useState(0); // Track rendering progress

    // Frame count state
    const [frameCount, setFrameCount] = useState(0);

    const handleConfigButtonClick = () => {
        setIsConfigModalOpen(true);
    };

    const handleCloseConfigModal = (frames) => {
        setIsConfigModalOpen(false);
        if (frames !== undefined) {
            // Handle the number of frames returned from ConfigModal
            console.log('Number of frames received from ConfigModal:', frames);
            setFrameCount(frames);
        }
    };

    const handleClosePreviewModal = () => {
        setIsPreviewModalOpen(false);
    };

    const handleCharacterSelectButtonClick = () => {
        setIsCharacterSelectModalOpen(true);
    };

    const handleCloseCharacterSelectModal = () => {
        setIsCharacterSelectModalOpen(false);
    };

    useEffect(() => {
        console.log('Model paths updated:', modelPaths);
    }, [modelPaths]);

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    const checkPathsExist = async (paths) => {
        const checkPath = async (path) => {
            try {
                const response = await fetch(path, { method: 'HEAD' }); // Use HEAD method to check existence
                console.log(`Checking path: ${path}, Status: ${response.status}`);
                return response.status === 200;
            } catch (error) {
                console.error(`Error checking path ${path}:`, error);
                return false;
            }
        };

        const results = await Promise.all(paths.map(checkPath));
        return paths.filter((_, index) => results[index]);
    };

    const handleButtonClick = async () => {
        const input = document.getElementById('modelPathsInput');
        const prompt1 = input.value;
        
        // Fetch the contents of /public/FBXlistings.txt
        const response = await fetch('/FBXlistings.txt');
        if (!response.ok) {
            throw new Error('Failed to fetch FBXlistings.txt');
        }
        const filesString = await response.text();

        console.log('Input value:', prompt1);

        try {
            // Call runPrompt with prompt1 and filesString
            const paths = await runPrompt(prompt1, filesString);
            console.log('Parsed paths:', paths);

            if (paths && paths.length > 0) {
                let updatedPaths = ['/models/Idle.fbx', ...paths.map(path => `/models/Motions/${path}.fbx`)];
                console.log('Updated paths (before filtering):', updatedPaths);

                // Check if all paths exist and filter out non-existing paths
                updatedPaths = await checkPathsExist(updatedPaths);
                console.log('Filtered paths:', updatedPaths);

                // Set exec in progress to true
                setIsExecInProgress(true);
                setHasRenderJob(true); // Indicate that a render job has been given

                // Define the requests related to motions
                const motionRequest = fetch(`${server_url}/config/motions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ motions: paths })
                });

                // Execute the motions request
                const motionResponse = await motionRequest;
                if (!motionResponse.ok) {
                    throw new Error(`Request failed with status ${motionResponse.status}`);
                }

                console.log('Motions configuration request successful');
                setModelPaths(updatedPaths);
                setUpdateFlag((prev) => !prev); // Toggle update flag to force re-render

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
            } else {
                console.error('No valid paths returned from runPrompt');
            }
        } catch (error) {
            console.error('Error during requests:', error);
        } finally {
            // Set exec in progress to false
            setIsExecInProgress(false);
        }
    };

    const handlePreviewClick = async () => {
        if (isExecInProgress) {
            try {
                // Fetch the rendering progress
                const response = await fetch(`${server_url}/notification`);
                if (response.ok) {
                    const { status } = await response.json();
                    setRenderProgress(status);
                } else {
                    console.error('Failed to fetch progress', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching progress:', error);
            }
            setShowAlert(true);
        } else if (!hasRenderJob) {
            setShowAlert(true);
        } else {
            // Open the preview modal
            setIsPreviewModalOpen(true);
        }
    };

    return (
        <div className="flex flex-col h-full bg-black">
            <div className="flex flex-row h-full flex-1">
                <div className="relative flex-grow h-full bg-black">
                    <div style={{ marginRight: '0px' }}> {/* Adjust this value to move the component left or right */}
                        <WebGLRenderer progressBarRef={progressBarRef} modelPaths={modelPaths} updateFlag={updateFlag} />
                        <div id="webGLpanel" className="flex bg-black justify-center mt-10 p-4">
                        <button 
                            id="preConfig" 
                            className="btn btn-outline btn-accent mb-3 rounded-l-full h-10 w-60 text-yellow-50 mx-2 animate-float glow"
                            onClick={handleConfigButtonClick}
                        >
                            Configure
                        </button>
                        <button 
                            id="character" 
                            className="btn btn-outline btn-accent mb-3 h-10 w-40 mx-2 rounded animate-float glow"
                            onClick={handleCharacterSelectButtonClick}
                        >
                            Character
                        </button>
                        <button 
                            id="preview" 
                            className={`btn ${hasRenderJob ? (isExecInProgress ? 'btn-accent' : 'btn-outline btn-accent') : 'btn-accent'} mb-3 rounded-r-full h-10 w-60 text-black animate-float glow`}
                            onClick={handlePreviewClick}
                        >
                            Preview
                        </button>
                        
                    </div>
                    </div>
                    <progress value={renderProgress} max="100" id="progressBar" ref={progressBarRef} className="absolute top-2 left-2"></progress>
                    
                </div>
            </div>
            <div id="inputBar" className="flex justify-center h-full w-full">
            <div className="flex justify-center items-center h-full w-3/4">
                <input
                    type="text"
                    id="modelPathsInput"
                    placeholder="Enter model paths separated by commas"
                    className="flex-grow p-2 mr-2 border border-accent rounded-l-full glow"
                    style={{ fontSize: '12px' }} // Adjust this value to change the font size
                />
                <button id="Send" className="btn glass p-2 bg-accent text-black rounded-r-full animate-float glow" onClick={handleButtonClick}>Send</button>
            </div>
        </div>

            {isConfigModalOpen && (
                <ConfigModal onClose={handleCloseConfigModal} />
            )}

            {isPreviewModalOpen && (
                <PreviewModal onClose={handleClosePreviewModal} frameCount={frameCount} />
            )}

            {isCharacterSelectModalOpen && (
                <CharacterSelectModal onClose={handleCloseCharacterSelectModal} />
            )}

            {showAlert && (
                <div className="fixed top-4 right-4 p-4 bg-yellow-500 text-black rounded-xl shadow-lg flex items-center space-x-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {isExecInProgress ? (
                        <span>Video rendering is still in progress ({renderProgress}%)</span>
                    ) : (
                        <span>No rendering job has been given</span>
                    )}
                </div>
            )}
            <style jsx>{`
                .spotlight {
                    position: absolute;
                    bottom: 0;
                    width: 100px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(255,255,255,0.6) 20%, rgba(255,255,255,0) 70%);
                    pointer-events: none;
                }
                .spotlight.left-0 {
                    left: 10%;
                }
                .spotlight.right-0 {
                    right: 10%;
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .glow {
                    box-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
                }
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
            `}</style>
        </div>
        
    );
};

export default FBXAnimations;
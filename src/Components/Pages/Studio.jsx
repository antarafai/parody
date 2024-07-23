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

    const checkPathsExist = (paths, filesString) => {
        // Split the filesString using regex to handle both commas and spaces
        const availableFiles = new Set(filesString.split(/[\s,]+/).map(file => file.trim()));
        return paths.filter(path => availableFiles.has(path));
    };

    const handleButtonClick = async () => {
        const input = document.getElementById('modelPathsInput');
        const prompt1 = input.value;
    
        const filesString = "angry_fists, angry_point, backflip, back_happy_walk, back_run, back_run_turn_right, big_head_hit, blow_kiss, bow_arrow, boxing_idle, boxing_pose, brutal_walk, cabbage_patch, cabinet_open, careful_walk, carry_run, cartwheel, center_block, cheering, cheer_fists, chest_block, clapping, cover_shoot, crawl_forward, crouch_to_stand, crouch_walk, crying, dismiss, dodge_right, dribble_basketball, drink, drinking, elbow_head, embarassed, excited, fight_idle_guard, fish_cast, fist_pump, float_flail, golf_swing, grab_rifle, groin_kick, happy_idle, head_hit, hip_hop_dance, hip_hop_wave, hook_punch, house_dance, hurricane_kick, idle, injured_walk, insult, intent_run, jab, jab_cross, jogging, jog_ring_entry, jog_with_box, jump, jumping, jump_ecstatic, jump_joy, kiss_long, kneel_point, laughing, lead_foot_kick, lead_hand_hook, lean_run, left_block, left_hit_reaction, left_side_step, left_strafe, left_strafe_walk, left_turn, left_turn_walk, light_hit_left, look_both_shoulders, look_down_point, mid_head_hit_left, mid_head_hit_right, mid_hook_punch, mid_straight_punch, military_salute, moonwalk, muay_thai_knee, nervous_look, nervous_look_right, nod, old_man_idle, open_door, paddle_canoe, peek_under_cup, pilot_shove_react, pilot_switches, play_drums, play_guitar, point, pointing, pull_lever, punch_bag, push_button, push_heavy, quick_rifle_walk, rifle_block, rifle_dodge, rifle_walk, right_block, right_turn_run, robot_dance, rub_shoulder, rummage, run, running, running_tired, run_backwards, run_fast, run_heavy, sad_walk_back, salsa_dance5, salsa_dancing_female, salsa_dancing_male, salute, seated_idle, shaking_hands, shaking_head, shame_face, sheath_sword, shim_sham1, shim_sham2, shrugging, sideways_run, sing, sit, sitting, sit_dodge_right, sit_kick_out, sit_knock_off, sit_wait, skinning_test, sneak_left, soccer_header, soccer_idle, soccer_juggle, soccer_receive, spin, stand, standing, standing_idle_holding_briefcase, stand_clap, stand_idle, strafe_left, stretch_arms, strike_jog, strut_walk, swagger_walk, swim_underwater, talking_on_phone, thoughtful_nod, thumbs_up, tread_water, uppercut, uppercut_face, walk, walking, walk_backwards, walk_sad, wave, wave_arms_dance, wave_over_seated, waving, writing, yawn, yawning, zombie_jab";

        console.log('Files string:', filesString);

        try {
            // Call runPrompt with prompt1 and filesString
            const paths = await runPrompt(prompt1, filesString);
            console.log('Parsed paths:', paths);

            if (paths && paths.length > 0) {
                // Filter paths immediately after runPrompt
                const filteredPaths = checkPathsExist(paths, filesString);
                console.log('Filtered paths:', filteredPaths);

                if (filteredPaths.length > 0) {
                    let updatedPaths = ['/models/Idle.fbx', ...filteredPaths.map(path => `/models/Motions/${path}.fbx`)];
                    console.log('Updated paths:', updatedPaths);

                    // Set exec in progress to true
                    setIsExecInProgress(true);
                    setHasRenderJob(true); // Indicate that a render job has been given

                    // Define the requests related to motions
                    const motionRequest = fetch(`${server_url}/config/motions`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ motions: filteredPaths })
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
                    console.error('No valid paths after filtering');
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
        <div className="flex flex-col h-screen">
            <div className="flex flex-row flex-1">
                <div id="sidePanel" className="flex flex-col bg-gray-900 p-4">
                    <button 
                        id="preConfig" 
                        className="btn bg-accent mb-3 rounded h-10 w-40 text-black"
                        onClick={handleConfigButtonClick}
                    >
                        CONFIGURE
                    </button>
                    <button 
                        id="preview" 
                        className={`btn ${hasRenderJob ? (isExecInProgress ? 'bg-gray-500' : 'bg-accent') : 'bg-red-500'} mb-3 rounded h-10 w-40 text-black`}
                        onClick={handlePreviewClick}
                    >
                        PREVIEW
                    </button>
                    <button 
                        id="character" 
                        className="btn bg-accent mb-3 rounded h-10 w-40 text-black"
                        onClick={handleCharacterSelectButtonClick}
                    >
                        CHARACTER
                    </button>
                    <button className="bg-gray-600 mb-3 rounded h-10 w-40"></button>
                    <button className="bg-gray-600 mb-3 rounded h-10 w-40"></button>
                </div>
                <div className="relative flex-grow h bg-gray-300">
                    <WebGLRenderer progressBarRef={progressBarRef} modelPaths={modelPaths} updateFlag={updateFlag} />
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
                <CharacterSelectModal isOpen={isCharacterSelectModalOpen} onClose={handleCloseCharacterSelectModal} />
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
        </div>
    );
};

export default FBXAnimations;
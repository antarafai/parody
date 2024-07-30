import React, { useRef, useState, useEffect } from 'react';
import WebGLRenderer from '../WebGL/WebGLRenderer';
import ConfigModal from '../WebGL/ConfigModal';
import PreviewModal from '../WebGL/PreviewModal';
import CharacterSelectModal from '../Modals/CharacterSelectModal'; // Import the CharacterSelectModal
import { runPrompt } from '../NLP/Prompt';
import MusicifyModal from '../Modals/MusicifyModal';
import MusicifyWarningModal from '../Modals/MusicifyWarningModal';
import InputBar from '../Input/InputBar';
import ExecProgressAlert from '../Alerts/ExecProgressAlert';

const server_url = process.env.REACT_APP_SERVER_URL;

const FBXAnimations = () => {
    const progressBarRef = useRef(null);
    const [modelPaths, setModelPaths] = useState(['/models/Ybot-Idle.fbx']);
    const [updateFlag, setUpdateFlag] = useState(false); // Ensure re-render
    const [isExecInProgress, setIsExecInProgress] = useState(false); // Track exec request status
    const [hasRenderJob, setHasRenderJob] = useState(false); // Track if render job has been given

    // Modal logic
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false); // State for preview modal
    const [isCharacterSelectModalOpen, setIsCharacterSelectModalOpen] = useState(false); // State for character select modal
    const [isMusicifyWarningModalOpen, setIsMusicifyWarningModalOpen] = useState(false); // State for Musicify warning modal
    const [isMusicifyModalOpen, setIsMusicifyModalOpen] = useState(false); // State for Musicify modal

    // Alert state
    const [showAlert, setShowAlert] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState('Ybot'); // Default to Ybot

    // Frame count state
    const [frameCount, setFrameCount] = useState(0);
    const [renderProgress, setRenderProgress] = useState(0); // Track rendering progress
    // Character state
    const [character, setCharacter] = useState(null);

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

    const handleCloseCharacterSelectModal = (character) => {
        setIsCharacterSelectModalOpen(false);
        setModelPaths([`/models/${selectedCharacter}-Idle.fbx`]);
        if (character) {
            setSelectedCharacter(character);
        }
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
    
        const YfilesString = "angry_fists, angry_point, backflip, back_happy_walk, back_run, back_run_turn_right, big_head_hit, blow_kiss, bow_arrow, boxing_idle, boxing_pose, brutal_walk, cabbage_patch, cabinet_open, careful_walk, carry_run, cartwheel, center_block, cheering, cheer_fists, chest_block, clapping, cover_shoot, crawl_forward, crouch_to_stand, crouch_walk, crying, dismiss, dodge_right, dribble_basketball, drink, drinking, elbow_head, embarassed, excited, fight_idle_guard, fish_cast, fist_pump, float_flail, golf_swing, grab_rifle, groin_kick, happy_idle, head_hit, hip_hop_dance, hip_hop_wave, hook_punch, house_dance, hurricane_kick, idle, injured_walk, insult, intent_run, jab, jab_cross, jogging, jog_ring_entry, jog_with_box, jump, jumping, jump_ecstatic, jump_joy, kiss_long, kneel_point, laughing, lead_foot_kick, lead_hand_hook, lean_run, left_block, left_hit_reaction, left_side_step, left_strafe, left_strafe_walk, left_turn, left_turn_walk, light_hit_left, look_both_shoulders, look_down_point, mid_head_hit_left, mid_head_hit_right, mid_hook_punch, mid_straight_punch, military_salute, moonwalk, muay_thai_knee, nervous_look, nervous_look_right, nod, old_man_idle, open_door, paddle_canoe, peek_under_cup, pilot_shove_react, pilot_switches, play_drums, play_guitar, point, pointing, pull_lever, punch_bag, push_button, push_heavy, quick_rifle_walk, rifle_block, rifle_dodge, rifle_walk, right_block, right_turn_run, robot_dance, rub_shoulder, rummage, run, running, running_tired, run_backwards, run_fast, run_heavy, sad_walk_back, salsa_dance5, salsa_dancing_female, salsa_dancing_male, salute, seated_idle, shaking_hands, shaking_head, shame_face, sheath_sword, shim_sham1, shim_sham2, shrugging, sideways_run, sing, sit, sitting, sit_dodge_right, sit_kick_out, sit_knock_off, sit_wait, skinning_test, sneak_left, soccer_header, soccer_idle, soccer_juggle, soccer_receive, spin, stand, standing, standing_idle_holding_briefcase, stand_clap, stand_idle, strafe_left, stretch_arms, strike_jog, strut_walk, swagger_walk, swim_underwater, talking_on_phone, thoughtful_nod, thumbs_up, tread_water, uppercut, uppercut_face, walk, walking, walk_backwards, walk_sad, wave, wave_arms_dance, wave_over_seated, waving, writing, yawn, yawning, zombie_jab";
        const XfilesString = "indian, ballerina, belly, booty_hip_hop, breakdance_ending_1, breakdance_ending_2, breakdance_ending_3, breakdance_footwork_1, breakdance_footwork_2, breakdance_footwork_3, breakdance_ready, breakdance_spin, breakdance_spin_2, breakdance_spin_head, breakdance_up, brooklyn_uprock, cross_leg_freeze, flair, flair_3, footwork_to_freeze, footwork_to_idle, footwork_to_idle_2, freezes, freeze_1, freeze_2, freeze_3, freeze_4, jazz, moonwalk_1, nerd_ymca, ready_pose, ready_pose_3, robot_hip_hop, salsa, samba, shopping_cart, shuffling, silly, slide_hip_hop, snake_hip_hop, swipes, thriller_2, twerk, twist, uprock, uprock_1, uprock_2, uprock_end_1, uprock_start_1, uprock_to_ground, uprock_to_ground_2, wave_hip_hop";
        
        // TODO: Make this YfilesString if Y-bot is selected or XfilesString if X-bot is selected
        const filesString = selectedCharacter === 'Xbot' ? XfilesString : YfilesString;

        try {
            // Call runPrompt with prompt1 and filesString
            const paths = await runPrompt(prompt1, filesString);
            console.log('Parsed paths:', paths);

            if (paths && paths.length > 0) {
                // Filter paths immediately after runPrompt
                const filteredPaths = checkPathsExist(paths, filesString);
                console.log('Filtered paths:', filteredPaths);

                if (filteredPaths.length > 0) {
                    let updatedPaths = [`/models/${selectedCharacter}-Idle.fbx`, ...filteredPaths.map(path => `/models/${selectedCharacter}/${path}.fbx`)];
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

    const handleMusicifyClick = () => {
        setIsMusicifyWarningModalOpen(true);
    };

    const handleAcceptMusicify = () => {
        setIsMusicifyWarningModalOpen(false);
        setIsMusicifyModalOpen(true);
    };

    const handleRejectMusicify = () => {
        setIsMusicifyWarningModalOpen(false);
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
                                id="musicify (experimental)"
                                className="btn btn-outline btn-accent mb-3 h-10 w-60 mx-2 rounded animate-float glow"
                                onClick={handleMusicifyClick}
                            >
                                Musicify
                            </button>
                            <button 
                                id="preview" 
                                className={`btn ${hasRenderJob ? (isExecInProgress ? 'btn-accent' : 'btn-outline btn-accent') : 'btn-disabled btn-outline btn-accent mx-2 rounded'} mb-3 rounded-r-full h-10 w-60 text-black animate-float glow`}
                                onClick={handlePreviewClick}
                            >
                                Preview
                            </button>
                        </div>
                    </div>
                    <progress value={renderProgress} max="100" id="progressBar" ref={progressBarRef} className="absolute top-2 left-2"></progress>
                </div>
            </div>

            <InputBar onButtonClick={handleButtonClick} />

            {isConfigModalOpen && (
                <ConfigModal onClose={handleCloseConfigModal} />
            )}

            {isPreviewModalOpen && (
                <PreviewModal onClose={handleClosePreviewModal} frameCount={frameCount} />
            )}

            {isCharacterSelectModalOpen && (
                <CharacterSelectModal 
                    isOpen={isCharacterSelectModalOpen} 
                    onClose={handleCloseCharacterSelectModal}
                    onSelectCharacter={(character) => setSelectedCharacter(character)}
                />
            )}
            
            {isMusicifyWarningModalOpen && (
                <MusicifyWarningModal 
                onAccept={handleAcceptMusicify} 
                onReject={handleRejectMusicify} 
                />
            )}

            {isMusicifyModalOpen && (
                <MusicifyModal onClose={() => setIsMusicifyModalOpen(false)} />
            )}

            {showAlert && (
                <ExecProgressAlert isExecInProgress={isExecInProgress} renderProgress={renderProgress} />
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
// Workflow.js
import { runPrompt2 } from "../NLP/Prompt";
const server_url = 'http://localhost:5000';

export const sendPostRequest = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }

  return response.json();
};

export const handleWorkflow = async (analysisResult, selectedFile, selectedSample, samples) => {
  try {
    // Step 1: Call runPrompt
    const prompt1 = "The song to be used has the following properties - Genre of the song: " + analysisResult.genreTags.join(', ') + ", Mood of the song: " + analysisResult.moodTags.join(', ') + ", Short Description: " + analysisResult.transformerCaption + ". Please select the dance moves from the available dance motions which match the song properties.";
    const filesString = "indian, ballerina, belly, booty_hip_hop, breakdance_ending_1, breakdance_ending_2, breakdance_ending_3, breakdance_footwork_1, breakdance_footwork_2, breakdance_footwork_3, breakdance_ready, breakdance_spin, breakdance_spin_2, breakdance_spin_head, breakdance_up, brooklyn_uprock, cross_leg_freeze, flair, flair_3, footwork_to_freeze, footwork_to_idle, footwork_to_idle_2, freezes, freeze_1, freeze_2, freeze_3, freeze_4, jazz, moonwalk_1, nerd_ymca, ready_pose, ready_pose_3, robot_hip_hop, salsa, samba, shopping_cart, shuffling, silly, slide_hip_hop, snake_hip_hop, swipes, thriller_2, twerk, twist, uprock, uprock_1, uprock_2, uprock_end_1, uprock_start_1, uprock_to_ground, uprock_to_ground_2, wave_hip_hop";
    const promptResult = await runPrompt2(prompt1, filesString);

    // Step 2: Filter the result
    const filteredResult = filterFunction(promptResult, filesString); 
    console.log('Filtered result:', filteredResult);

    // Step 3: Send to /config/motions
    // Define the requests related to motions
    const motionRequest = fetch(`${server_url}/config/motions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ motions: filteredResult })
    });
    // Execute the motions request
    const motionResponse = await motionRequest;
    if (!motionResponse.ok) {
        throw new Error(`Request failed with status ${motionResponse.status}`);
    }
    console.log('Motions configuration request successful');
    // Step 4: Send analysisResult and audio file to /generate
    const formData = new FormData();
    if (selectedFile) {
      if (typeof selectedFile === 'string') {
        const response = await fetch(selectedFile);
        const blob = await response.blob();
        formData.append('file_from_react', blob, selectedSample);
      } else {
        formData.append('file', selectedFile);
      }
    } else if (selectedSample) {
      const selectedSampleData = samples.find(sample => sample.value === selectedSample);
      if (selectedSampleData.isCustom) {
        const response = await fetch(selectedSampleData.filePath);
        const blob = await response.blob();
        formData.append('file_from_react', blob, selectedSample);
      } else {
        const response = await fetch(`/sample-music/${selectedSample}`);
        const blob = await response.blob();
        formData.append('file_from_react', blob, selectedSample);
      }
    }
    formData.append('analysisResult', JSON.stringify(analysisResult));

    const generateResponse = await fetch(`${server_url}/generate`, {
      method: 'POST',
      body: formData,
    });

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      throw new Error(`HTTP error! status: ${generateResponse.status}, message: ${errorText}`);
    }

    await generateResponse.json();

    // Define the requests in sequence
    const requests = [
      // Step 5: Send to /config/frames
      fetch(`${server_url}/config/frames`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ total_frames: 400 }) // input1 denote number of frames
      }),
      // Step 6: Send to /config/import
      fetch(`${server_url}/config/import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ import_path: "/home/mizookie/Motions/Motions/Motions" })
      }),
      // Step 7: Send to /config/render
      fetch(`${server_url}/config/render`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ render_path: "/home/mizookie/Renders" })
      })
    ];

    try {
      // Execute the requests sequentially
      for (const request of requests) {
          const response = await request;
          if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
          }
      }
      console.log('All configuration requests successful');
    } catch (error) {
      console.error('Error during configuration requests', error);
    }

    // Step 8: Send GET request to /exec
    const execResponse = await fetch(`${server_url}/exec`, {
      method: 'GET',
    });

    if (!execResponse.ok) {
      const errorText = await execResponse.text();
      throw new Error(`HTTP error! status: ${execResponse.status}, message: ${errorText}`);
    }

    // Use a reader to process the response in chunks
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
    alert('Execution completed successfully.');

  } catch (error) {
    console.error('Error in workflow:', error);
    alert(`Error in workflow: ${error.message}`);
  }
};

// Filter function
export const filterFunction = (paths, filesString) => {
  // Split the filesString using regex to handle both commas and spaces
  const availableFiles = new Set(filesString.split(/[\s,]+/).map(file => file.trim()));
  return paths.filter(path => availableFiles.has(path));
};
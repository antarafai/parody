// Workflow.js
import { server_url } from '../config'; // Adjust the import based on your project structure

export const runPrompt = async (prompt, filesString) => {
  // Simulate runPrompt function
  return new Promise((resolve) => {
    setTimeout(() => resolve("filtered_result"), 1000);
  });
};

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
    const prompt1 = JSON.stringify(analysisResult);
    const filesString = "sample filesString"; // Replace with actual filesString
    const promptResult = await runPrompt(prompt1, filesString);

    // Step 2: Filter the result (assuming filterFunction is defined elsewhere)
    const filteredResult = await filterFunction(promptResult); // Placeholder function call

    // Step 3: Send to /config/motions
    await sendPostRequest(`${server_url}/config/motions`, { motions: filteredResult });

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

    // Step 5: Send to /config/character
    await sendPostRequest(`${server_url}/config/character`, {
      character: "/home/mizookie/anigen-flask-app/Ybot.blend",
    });

    // Step 6: Send to /config/frames
    await sendPostRequest(`${server_url}/config/frames`, {
      total_frames: 400,
    });

    // Step 7: Send to /config/import
    await sendPostRequest(`${server_url}/config/import`, {
      import_path: "/home/mizookie/Motions/Motions/Motions",
    });

    // Step 8: Send to /config/render
    await sendPostRequest(`${server_url}/config/render`, {
      render_path: "/home/mizookie/Renders",
    });

    // Step 9: Send GET request to /exec
    const execResponse = await fetch(`${server_url}/exec`, {
      method: 'GET',
    });

    if (!execResponse.ok) {
      const errorText = await execResponse.text();
      throw new Error(`HTTP error! status: ${execResponse.status}, message: ${errorText}`);
    }

    const execResult = await execResponse.json();
    console.log('Exec API result:', execResult);
    alert('Execution completed successfully.');

  } catch (error) {
    console.error('Error in workflow:', error);
    alert(`Error in workflow: ${error.message}`);
  }
};

// Placeholder filter function
export const filterFunction = async (result) => {
  // Implement your filter logic here
  return result;
};
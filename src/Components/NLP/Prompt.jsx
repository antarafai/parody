// Function to send a prompt to the new endpoint and process the response
const inference_endpoint = process.env.LLM_ENDPOINT;

const runPrompt = async (prompt1, filesString) => {
  try {
    const formattedPrompt = `Available motions: ${filesString}\n\nExtract the key motions from the following sentence and return only the motion array.`;

    console.log(formattedPrompt);

    const response = await fetch(
      inference_endpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Meta-Llama-3-8B-Instruct',
          messages: [
            {
              role: 'system',
              content: 'Extract the key motions from sentences and return only the motion array in the format ["motion1", "motion2", ...]. Do not include any additional text or characters, not even introductory phrases or explanations.'
            },
            {
              role: 'user',
              content: formattedPrompt
            },
            {
              role: 'user',
              content: prompt1
            }
          ],
          max_tokens: 500
        })
      }
    );

    const result = await response.json();

    let text = '';
    for (const chunk of result.choices[0].message.content) {
      text += chunk;
    }

    const regexPattern = /[\w-]+/gi;
    const extractFilenames = (input) => {
      const matches = input.match(regexPattern);
      return matches ? matches : [];
    };

    const motions = text.split('\n').flatMap(extractFilenames);
    console.log("Filenames from output:", motions);

    return motions;
  } catch (error) {
    console.error('Error during request:', error);
    throw error;
  }
};

const runPrompt2 = async (prompt1, filesString) => {
  try {
    const formattedPrompt = `Available dance motions: ${filesString}\n\nExtract the key dance motions from the following sentence and return only the motion array.`;

    console.log("Formatted Prompt:", formattedPrompt);
    console.log("Prompt1:", prompt1);
    console.log("Files String:", filesString);
    const response = await fetch(
      inference_endpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Meta-Llama-3-8B-Instruct',
          messages: [
            {
              role: 'system',
              content: 'Analyse the mood, genres and short description of the song, and accordingly, matching these properties, extract only the key relevant dance motions (try to be very relevant and specific, rather than generalising) available and return only the motion array in the format ["motion1", "motion2", ...]. Do not include any additional text or characters, not even introductory phrases or explanations.'
            },
            {
              role: 'user',
              content: formattedPrompt
            },
            {
              role: 'user',
              content: prompt1
            }
          ],
          max_tokens: 500
        })
      }
    );

    const result = await response.json();

    let text = '';
    for (const chunk of result.choices[0].message.content) {
      text += chunk;
    }

    const regexPattern = /[\w-]+/gi;
    const extractFilenames = (input) => {
      const matches = input.match(regexPattern);
      return matches ? matches : [];
    };

    const motions = text.split('\n').flatMap(extractFilenames);
    console.log("Filenames from output:", motions);

    return motions;
  } catch (error) {
    console.error('Error during request:', error);
    throw error;
  }
};

export { runPrompt, runPrompt2 };
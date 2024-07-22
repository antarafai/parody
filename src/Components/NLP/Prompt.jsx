import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const API_KEY = 'your-api-key-here';  // Replace with your actual API key

const genAI = new GoogleGenerativeAI(API_KEY);

// Function to send a prompt to Google GEMINI and process the response
const runPrompt = async (prompt1, filesString) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE }
      ]
    });

    const formattedPrompt = `${prompt1}. Extract the key motions in this sentence strictly from the available files listed below.
    ${filesString}
    The list of available files has file names separated by commas, and motions are separated by underscores (e.g., angry_fists, walk, backflip, back_happy_walk, back_run).

    Return only the motion names that match the file names in the filesString. Each motion should be represented by a single file name if it matches. If the sentence specifies a person's gender, select the file name according to that gender.

    Ensure repeated motions are included again in the order they appear in the sentence. For example, if a person is running, then jumps and continues running, the list of motions should be [run, jump, run].

    If none of the motions or at least one motion does not exist in the filesString, return "null".`;
    
    console.log(formattedPrompt);

    const result = await model.generateContentStream([formattedPrompt]);
    let text = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      text += chunkText;
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
    console.error('Error during requests:', error);
    throw error;
  }
};

export default runPrompt;
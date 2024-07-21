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

    const formattedPrompt = `${prompt1}. Extract out the key motions in this sentence. ${filesString}
    This is the list of files. Return me only motion names that match the file names in the filesString 
    (One file for each motion if it is the same) (If the sentence mentions a person's gender, try to find the file according to that gender). 
    Lastly, if there are repeated motions, make sure they are included again. (Keep the order of the motions the same as the sentence. 
    Example: if a person is running and then jumps and continues running. The list of motions should be [run, jump, run]) 
    If there are none or one of the motions does not exist in the list of files, return "null"`;

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
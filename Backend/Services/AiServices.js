import { GoogleGenerativeAI } from "@google/generative-ai";



const genAI = new GoogleGenerativeAI(process.env.Google_AI_Key);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


const getResults = async ({prompt}) => {
    const result = await model.generateContent(prompt);
    return result.response.text()
    
}
export {getResults}
// pages/api/chatbot.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { loadModules } from "./utils/loadModules";
import { logToCsv } from "./utils/doLog"
import 'dotenv/config';

const { functions, declarations} = loadModules();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const generativeModel = genAI.getGenerativeModel({
    // * Must be a model that supports function calling, like a Gemini 1.5 model
    model: "gemini-1.5-flash",

    // * Must specify the function declarations for function calling
    tools: {
        functionDeclarations: declarations,
    },
});

const chat = generativeModel.startChat();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        var response = "";
        var called = "";

        const { message } = req.body;

        try {

            const result = await chat.sendMessage(message);
                    
            if ( Array.isArray( result.response.functionCalls() ) && ( result.response.functionCalls() ).length > 0) {
                // gets the first function call found. (best suited??)
                const call = result.response.functionCalls()[0];

                var moduleResult;
                
                try {
                    moduleResult = await functions[call.name](call.args);
                } catch (e) {
                    return res.status(500).json({ response : "Erro interno no servidor: " + e.message});
                }
            
                // Send the module response back
                const result2 = await chat.sendMessage([{functionResponse: {
                    name: call.name,
                    response: moduleResult
                }}]);
            
                response = result2.response.text();
                called = call.name;
            } else {
                response = result.response.text();
                called = null;
            }
        } catch (e) {
            return res.status(500).json({ response : "Erro ao conectar com a LLM: " + e.message});
        }

        await logToCsv("logs/gemini.csv", [message, called, response]);
        return res.status(200).json({ response : response});
    }
  
    return res.status(405).json({ error: 'Method Not Allowed' });
}
  
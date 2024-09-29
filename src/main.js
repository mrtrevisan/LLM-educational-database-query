import { GoogleGenerativeAI } from "@google/generative-ai";
import { loadModules } from "./utils/loadModules.js";
import 'dotenv/config';

try {
	const { functions, declarations} = await loadModules();

	try {
		const genAI = new GoogleGenerativeAI(process.env.API_KEY);

		console.log('Insert prompt then type Enter:\n');

		process.stdin.on('data', async (data) => {
			const prompt = data.toString().slice(0, -1);

			if (prompt === 'exit') process.exit(0);
			
			const generativeModel = genAI.getGenerativeModel({
				// * Must be a model that supports function calling, like a Gemini 1.5 model
				model: "gemini-1.5-flash",
			
				// * Must specify the function declarations for function calling
				tools: {
					functionDeclarations: declarations,
				},
			});
			
			const chat = generativeModel.startChat();		
			const result = await chat.sendMessage(prompt);
			
			if ( Array.isArray( result.response.functionCalls() ) && ( result.response.functionCalls() ).length > 0) {
				// gets the first function call found. (best suited??)
				const call = result.response.functionCalls()[0];

				const moduleResult = await functions[call.name](call.args);
			
				// Send the module response back
				const result2 = await chat.sendMessage([{functionResponse: {
					name: call.name,
					response: moduleResult
				}}]);
			
				// Log the text response.
				console.log(result2.response.text());
			} else {
				// sends an error to the model, for a text response anyways
				const result2 = await chat.sendMessage([{functionResponse: {
					name: "null",
					response: { error : "No handler module found that suits the prompt" }
				}}]);
			
				console.log(result2.response.text());
			}
		});
	} catch (e) {
		console.error('Error connecting to LLM API:', e.message);
		process.exit();
	}
} catch (e) {
	console.error('Error importing modules:', e.message);
	process.exit();
}

import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

import fs from 'fs/promises';
import path from 'path';

const functions = {};
const declarations = [];

const modulesPath = path.join(process.cwd(), 'src/modules');

try {
	const files = await fs.readdir(modulesPath);

	// Filter .js files and dynamically import them
	const importPromises = files
		.filter(file => file.endsWith('.js'))
		.map(file => import(path.join(modulesPath, file)));

	const modules = await Promise.all(importPromises);

	// Extract func and decl from each module and push them to respective arrays
	for (const moduleEx of modules) {
		if (moduleEx.func && moduleEx.decl) {
			Object.assign(functions, moduleEx.func);
			declarations.push(moduleEx.decl);
		} else {
			continue;
		}
	}

	// Now funcsArray and declsArray contain all the functions and declarations
	console.log('Functions:', functions);
	console.log('Declarations:', declarations);
} catch (e) {
	console.error('Error reading directory:', e.message);
}

try {
	// Access your API key as an environment variable
	const genAI = new GoogleGenerativeAI(process.env.API_KEY);

	// Ask a question to the user
	console.log('Insert prompt then type Enter:\n');

	process.stdin.on('data', async (data) => {
		const prompt = data.toString();
		
		const generativeModel = genAI.getGenerativeModel({
			// Use a model that supports function calling, like a Gemini 1.5 model
			model: "gemini-1.5-flash",
		
			// Specify the function declaration.
			tools: {
				functionDeclarations: declarations,
			},
		});
		
		const chat = generativeModel.startChat();
		
		// Send the message to the model.
		const result = await chat.sendMessage(prompt);
		
		if ( Array.isArray( result.response.functionCalls() ) && ( result.response.functionCalls() ).length > 0) {
			// For simplicity, this uses the first function call found.
			const call = result.response.functionCalls()[0];

			// Call the executable function named in the function call
			// with the arguments specified in the function call and
			// let it call the hypothetical API.
			const apiResponse = await functions[call.name](call.args);
		
			// Send the API response back to the model so it can generate
			// a text response that can be displayed to the user.
			const result2 = await chat.sendMessage([{functionResponse: {
				name: call.name,
				response: apiResponse
			}}]);
		
			// Log the text response.
			console.log(result2.response.text());
		} else {
			const result2 = await chat.sendMessage([{functionResponse: {
				name: "none",
				response: { error : "No handler found for the prompt" }
			}}]);
		
			// Log the text response.
			console.log(result2.response.text());
		}

		// Close the input stream if necessary
		process.exit(); // Exit the process once input is handled
	});
} catch (e) {
	console.error('Error connecting to LLM API:', e.message);
	process.exit();
}


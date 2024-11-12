// import ollama from 'ollama';
// import { loadModules } from "../common/utils/loadModules.js";
// import { logToCsv } from "../common/utils/doLog.js";
// import 'dotenv/config';

// const model = "llama3.1:8b";

// try {
// 	const { functions, declarations} = await loadModules("src/llama/modules");
// 	// console.log(declarations);
	
// 	process.stdout.write("Insert the prompt and type Enter:\n");
// 	process.stdin.on('data', async (data) => {
// 		const messages = [{ type: 'system', content:
// 			'You will help the user retrieve information from a BRAZILLIAN educational database' +
// 			'Only answer questions about INSTITUTIONS by using the response from the tools ' +
// 			'When asked for information about INSTITUTIONS, if you have not called any tool, call it ' + 
// 			'Never guess any INSTITUTION information ' +
// 			'Do not be chatty ' +
// 			'Give short answers when possible'
// 		}];

// 		const prompt = data.toString();
// 		if (prompt.replace('\n', '') === 'exit') process.exit(0);

// 		messages.push({ role: 'user', content: prompt });
// 		const response = await ollama.chat({ model: model, messages: messages, tools: declarations });

// 		if (response.message.tool_calls && (response.message.tool_calls.length != 0)) {
// 			messages.push(response.message);

// 			const tool = response.message.tool_calls[0];
			
// 			console.log('CALLED:' + tool.function.name);
// 			const func = functions[tool.function.name];

// 			if (func) {
// 				const funcResponse = await func(tool.function.arguments);
// 				messages.push({ role: 'tool', content: funcResponse });
// 			} else {
// 				messages.push({ role: 'tool', content: 'invalid tool called' });
// 			}

// 			// console.log(messages);
// 			// process.exit();
			
// 			const response2 = await ollama.chat({ model: model, messages: messages, tools: declarations });
// 			console.log(response2.message.content);

// 			await logToCsv("logs/llama.csv", [prompt, tool.function.name, response2.message.content]);
// 		} else { 
// 			console.log(response.message.content);
// 			await logToCsv("logs/llama.csv", [prompt, 'none', response.message.content]);
// 		}
// 	});
// } catch (e) {
// 	console.error(e.message);
// }
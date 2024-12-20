import ollama from 'ollama';
import { loadModules } from "./utils/loadModules.js";
import { doLog } from "./utils/doLog.js";

const model = "llama3.1:8b";

try {
	const { functions, declarations} = loadModules("src/llama/modules");
    const logData = {};
	
	process.stdout.write("Insert the prompt and type Enter:\n");
	process.stdin.on('data', async (data) => {
		const messages = [{ type: 'system', content:
			'Você vai ajudar a recuperar informações de uma base de dados educacional' +
			'Responda perguntas sobre INSTITUIÇÕES utilizando as ferramentas' +
			'Chame as FUNÇÕES fornecidas para responder' + 
			'Nunca adivinhe' +
			'Prefira respostas curtas quando possível'
		}];

		const prompt = data.toString();
        logData.prompt = prompt;

		messages.push({ role: 'user', content: prompt });
		const response = await ollama.chat({ model: model, messages: messages, tools: declarations });

		if (response.message.tool_calls && (response.message.tool_calls.length != 0)) {
			messages.push(response.message);
			const tool = response.message.tool_calls[0];

            logData.tool = tool.function.name;
            logData.arguments = tool.function.arguments;
			
			// console.log('CALLED:' + tool.function.name);
			const func = functions[tool.function.name];
			if (func) {
				const funcResponse = await func(tool.function.arguments);
				messages.push({ role: 'tool', content: funcResponse });
			} else {
				messages.push({ role: 'tool', content: 'invalid tool called' });
			}
			
			const response2 = await ollama.chat({ model: model, messages: messages, tools: declarations });

            logData.response = response2.message.content;
            console.log(response2.message.content);
		} else {
            logData.response = response.message.content;
			console.log(response.message.content);
		}

        await doLog('logs/llama.txt', logData);
	});
} catch (e) {
	console.error(e.message);
}
import { GoogleGenerativeAI } from "@google/generative-ai";
import { loadModules } from "./utils/loadModules";
import { loadSchemas } from "./utils/loadSchemas";
import { doLog } from "./utils/doLog"
import 'dotenv/config';

const model = 'gemini-1.5-pro';

const { functions, declarations } = loadModules();

const genAI = new GoogleGenerativeAI(process.env.API_KEY).getGenerativeModel({
    // * Must be a model that supports function calling, like a Gemini 1.5 model
    model: model,

    // * Must specify the function declarations for function calling
    tools: {
        functionDeclarations: declarations,
    },
})

const chat = genAI.startChat();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const logData = {};
        logData.model = model;
        var response;

        const { message } = req.body;
        const schema = loadSchemas(message);

        // return res.status(200).json({ response : JSON.stringify(declarations) });
        // return res.status(200).json({ response : JSON.stringify(schema) });
        logData.message = message;

        try {
            const prompt = `Dado o seguinte esquema: 
            ${JSON.stringify(schema, null, 4)} 
            Use as funções para responder a pergunta:
            ${message}
            Dicas: Ao escrever qualquer sql, prefira usar LIKE para comparação de strings;
            Ao escrever qualquer sql, use a função LCASE() para envolver colunas e valores do tipo VARCHAR;
            NÃO é necessário escapar caracteres usando a contra-barra, esse caracter NÃO é aceito;
            Por exemplo, WHERE LCASE(NOME) LIKE LCASE('Gemini');
            `;

            // return res.status(200).json({ response : prompt });

            const result = await chat.sendMessage(prompt);
                    
            if ( Array.isArray( result.response.functionCalls() ) && ( result.response.functionCalls() ).length > 0) {
                // gets the first function call found. (best suited??)
                const call = result.response.functionCalls()[0];

                // return res.status(200).json({ response : JSON.stringify(result.response.functionCalls()[0]) });
                logData.functionCall = JSON.stringify( result.response.functionCalls()[0] );
                
                try {
                    const moduleResult = await functions[call.name](call.args);
                    // return res.status(200).json({ response : JSON.stringify(moduleResult) });
                    logData.moduleResult = JSON.stringify(moduleResult);
                
                    // Send the module response back
                    const result2 = await chat.sendMessage([{functionResponse: {
                        name: call.name,
                        response: moduleResult
                    }}]);
                
                    response = result2.response.text();
                } catch (e) {
                    return res.status(500).json({ response : "Erro interno: " + e.message});
                }
            } else {
                response = result.response.text();
            }
        } catch (e) {
            return res.status(500).json({ response : "Erro ao conectar com a LLM: " + e.message});
        }

        logData.response = response;
        await doLog("logs/aval-pro.txt", logData);

        return res.status(200).json({ response : response});
    }
  
    return res.status(405).json({ error: 'Method Not Allowed' });
}
  
import { GoogleGenerativeAI } from "@google/generative-ai";
import { loadModules } from "./utils/loadModules";
import { doLog } from "./utils/doLog"
import 'dotenv/config';
import fs from 'fs';

const loadRelevantSchemas = (message) => {
    const relevant = [];

    const cleanMessage = message.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
    const schemas = JSON.parse(fs.readFileSync('./pages/api/db/schema.json', 'utf-8'));

    for (const s of schemas) {
        for (const word of s.PalavrasChave) {
            if (cleanMessage.includes(word)) {
                relevant.push({tabela : s.Tabela, colunas : s.Colunas});
                continue;
            }
        }
    }

    return relevant;
}

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
        const logData = {};
        var response;

        const { message } = req.body;
        const schema = loadRelevantSchemas(message);

        // return res.status(200).json({ response : JSON.stringify(schema) });
        logData.message = message;

        try {
            const prompt = `Dado o seguinte esquema: 
            ${JSON.stringify(schema, null, 4)} 
            Se necessário, use as ferramentas passadas para responder a pergunta: 
            ${message}
            Dicas: Ao escrever qualquer sql, prefira usar LIKE para comparação de strings;
            Ao escrever qualquer sql, use a função LCASE() para envolver colunas e valores do tipo VARCHAR;
            O caracter backslash NÃO é aceito;
            Por exemplo, WHERE LCASE(NOME) LIKE LCASE('Gemini');
            `;

            // return res.status(200).json({ response : prompt });

            const result = await chat.sendMessage(prompt);
                    
            if ( Array.isArray( result.response.functionCalls() ) && ( result.response.functionCalls() ).length > 0) {
                // gets the first function call found. (best suited??)
                const call = result.response.functionCalls()[0];

                // return res.status(200).json({ response : JSON.stringify(result.response.functionCalls()[0]) });
                logData.functionCall = JSON.stringify( result.response.functionCalls()[0] );

                var moduleResult;
                
                try {
                    moduleResult = await functions[call.name](call.args);
                } catch (e) {
                    return res.status(500).json({ response : "Erro interno no banco: " + e.message});
                }

                // return res.status(200).json({ response : JSON.stringify(moduleResult) });
                logData.moduleResult = JSON.stringify(moduleResult);
            
                // Send the module response back
                const result2 = await chat.sendMessage([{functionResponse: {
                    name: call.name,
                    response: moduleResult
                }}]);
            
                response = result2.response.text();
            } else {
                response = result.response.text();
            }
        } catch (e) {
            return res.status(500).json({ response : "Erro ao conectar com a LLM: " + e.message});
        }

        logData.response = response;

        await doLog("logs/gemini.txt", logData);
        return res.status(200).json({ response : response});
    }
  
    return res.status(405).json({ error: 'Method Not Allowed' });
}
  
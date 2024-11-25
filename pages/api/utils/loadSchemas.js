import fs from 'fs';

export const loadSchemas = (message) => {
    const relevant = [];
    const cleanMessage = message.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const schemas = JSON.parse(fs.readFileSync('./pages/api/db/schema.json', 'utf-8'));

    for (const s of schemas) {
        for (const word of s.PalavrasChave) {
            if (cleanMessage.includes(word)) {
                relevant.push({tabela : s.Tabela, colunas : s.Colunas});
                break;
            }
        }
    }

    return relevant;
}
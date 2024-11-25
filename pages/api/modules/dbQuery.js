import { runQuery } from "../db/db2Client.js"

export const module = [
	// function
	{
		dbQuery : async ( { sql } ) => {
            const sql_ = "SET SCHEMA INEP; " + sql;

			return { result : await runQuery(sql_) };
		}
	},

	// Description
	{
		name: "dbQuery",
		parameters: {
			type: "OBJECT",
			properties: {
				sql: {
					type: "STRING",
					description: "consulta em SQL",
				}
			},
			required: ["sql"],
		},
		description : "Essa função recupera informações de uma base de dados de instituições educacionais."
	}
]

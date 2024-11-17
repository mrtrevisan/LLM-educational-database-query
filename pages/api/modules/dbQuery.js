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
					description: "sql query to run",
				}
			},
			required: ["sql"],
		},
		description : "receives a sql query, runs it on the database, then returns the results"
	}
]

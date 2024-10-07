import { runQuery } from "../db/mysqlClient.js"
import { readFileSync } from "fs";

export const module = [
	// function
	{
		IESSqlQuery : async ( sql ) => {
			// console.log(sql);
			// return;

			const query = sql.select + " FROM ED_SUP_IES " + sql.where ?? "";
			// console.log(query);
			// return;

			const res = await runQuery(query);
			// console.log(res);

			const res2 = res.reduce((acc, i) => {
				const [key, value] = Object.entries(i)[0]; // Extrai a chave e o valor de cada objeto
				if (acc[key]) {
					// Se a chave já existir no acumulador, transforma em array ou adiciona ao array existente
					acc[key] = Array.isArray(acc[key]) ? [...acc[key], value] : [acc[key], value];
				} else {
					// Caso a chave ainda não exista, simplesmente atribua o valor
					acc[key] = value;
				}
				return acc;
			}, {});

			console.log("res2 :", res2)
			return {sqlResult : res};
		}
	},

	// Description
	{
		name: "IESSqlQuery",
		parameters: {
			type: "OBJECT",
			description: "Sql parameters to query the institutions table",
			properties: {
				select: {
					type: "STRING",
					description: "SELECT clause to form the sql query, for example SELECT NO_IES. MUST contain the word SELECT",
				},
				where: {
					type: "STRING",
					description: "WHERE clause to form te sql query, for example WHERE IN_CAPITAL_IES = 1. MUST contain the word WHERE"
				}
			},
			required: ["select"],
		},
		description : "This function receives a sql and uses it to query data directly from the institutions' mysql table, the table has the following schema: " + readFileSync("./src/db/IESSchema.json" , 'utf-8'),
	}
]

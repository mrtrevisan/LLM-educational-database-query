// import { runQuery } from "../db/mysqlClient.js"
// import { readFileSync } from "fs";

// export const module = [
// 	// function
// 	{
// 		IESSqlQuery : async ( sql ) => {
// 			console.log("sql: ", sql);
// 			const res = await runQuery(sql);
// 			// console.log(res);

// 			const res2 = res.reduce((acc, i) => {
// 				const [key, value] = Object.entries(i)[0]; // Extrai a chave e o valor de cada objeto
// 				if (acc[key]) {
// 					// Se a chave já existir no acumulador, transforma em array ou adiciona ao array existente
// 					acc[key] = Array.isArray(acc[key]) ? [...acc[key], value] : [acc[key], value];
// 				} else {
// 					// Caso a chave ainda não exista, simplesmente atribua o valor
// 					acc[key] = value;
// 				}
// 				return acc;
// 			}, {});

// 			console.log("res: ", res2)
// 			return {sqlResult : res};
// 		}
// 	},

// 	// Description
// 	{
// 		name: "IESSqlQuery",
// 		parameters: {
// 			type: "STRING",
// 			description: "Sql statement to query the institutions table. For example, SELECT NO_IES FROM ED_SUP_IES WHERE SG_IES = 'UFSM'",
// 		},
// 		description : "This function receives an sql statement and queries the institutions' mysql table. The table has the following schema: " + readFileSync("./src/db/IESSchema.json" , 'utf-8'),
// 	}
// ]

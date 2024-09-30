import { runQuery } from "../db/mysqlClient.js"
import { title } from "../utils/titleStr.js"

export const module = [
	// function
	{
		IESList : async ( where ) => {
			var sql = ` 
				SELECT NO_IES
				FROM mec.ED_SUP_IES
			`;

			if (where.regiao) {
				sql += `WHERE NO_REGIAO_IES = '${where.regiao}'`;
			} 

			if (where.uf) {
				if (!sql.includes('WHERE')) sql += `WHERE NO_UF_IES = '${where.uf}'`;
				else sql += `AND NO_UF_IES = '${where.uf}'`
			}

			const res = await runQuery(sql);

			const res2 = Object.keys(res).reduce(
				(acc, key) => {
					acc.push(title(res[key].NO_IES));
					return acc;
				}, []
			)
			return { list : res2, filter : where };
		}
	},

	// Description
	{
		name: "IESList",
		parameters: {
			type: "OBJECT",
			description: "Filter for the Institution listing procces",
			properties: {
				regiao: {
					type: "STRING",
					description: "Region (macroregion) where the institutions are located. Can be any string in Kebab Case.",
				},
				uf: {
					type: "STRING",
					description: "Name of the state where the institution is. Must be a string which the words are separated by one empty space. Translate acronyms to the full extent name."
				}
			},
			required: [],
		},
		description : "Returns the List of institutions in the database, according to the filter passed. The filter atributes must be in Brazillian Portuguese. Async function."
	}
]

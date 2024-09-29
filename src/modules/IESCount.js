import { runQuery } from "../db/mysqlClient.js"

export const module = [
	// function
	{
		IESCount : async ( where ) => {
			var sql = ` 
				SELECT COUNT(*)
				FROM mec.ED_SUP_IES
			`;

			if (where.regiao) {
				sql += `WHERE NO_REGIAO_IES = '${where.regiao}'`;
			} 

			if (where.uf) {
				if (!sql.includes('WHERE')) sql += `WHERE NO_UF_IES = '${where.uf}'`;
				else sql += `AND NO_UF_IES = '${where.uf}'`
			}

			return { ... (await runQuery(sql))[0], filter : where };
		}
	},

	// Description
	{
		name: "IESCount",
		parameters: {
			type: "OBJECT",
			description: "Filter for the Institution count procces",
			properties: {
				regiao: {
					type: "STRING",
					description: "Region (macroregion) where the institutions are located. Can be any string in Kebab Case.",
				},
				uf: {
					type: "STRING",
					description: "Name of the state where the institution is. Must be a string which the words are separated by one empty space."
				}
			},
			required: [],
		},
		description : "Returns the count of institutions in the database, according to the filter passed. The filter atributes must be in Brazillian Portuguese. Async function."
	}
]

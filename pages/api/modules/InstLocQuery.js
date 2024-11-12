import { runQuery } from "../db/db2Client.js"

export const module = [
	// function
	{
		InstitutionLocationQuery : async ( { sql_select, sql_where } ) => {
			// console.log("select: ", sql_select);
			// console.log("where: ", sql_where);

			var select = sql_select.replace(/\\/g, "");
			var where = sql_where.replace(/\\/g, "");
			
			if (!select.includes("SELECT")) select = "SELECT " + select;
			if (!where.includes("WHERE")) where = "WHERE " + where;

			const sql = `
				${select}
				FROM INEP.CENSO_IES ies
					INNER JOIN INEP.MUNICIPIOS_IBGE mu ON ies.COD_MUNICIPIO = mu.COD_IBGE
					INNER JOIN INEP.MICROREGIOES_IBGE mi ON mu.COD_MICROREGIAO_IBGE = mi.COD_MICROREGIAO_IBGE
					INNER JOIN INEP.MESOREGIOES_IBGE me ON mi.COD_MESOREGIAO_IBGE = me.COD_MESOREGIAO_IBGE 
					INNER JOIN INEP.UF_IBGE uf ON me.COD_UF_IBGE = uf.UF_IBGE
					INNER JOIN INEP.REGIOES_IBGE re ON uf.COD_REGIAO_IBGE = re.COD_REGIAO_IBGE
				${where}`;

			console.log(sql);			
			const res = await runQuery(sql);
			// console.log("res:", res)

			return {sqlResult : res};
		}
	},

	// Description
	{
		name: "InstitutionLocationQuery",
		parameters: {
			type: "OBJECT",
			properties: {
				sql_select : {
					type: "STRING",
					description: "SELECT clause to form the sql. For example, 'SELECT SIGLA_IES' or 'COUNT(*)'",
				},
				sql_where : {
					type: "STRING",
					description: "WHERE clause to form the sql. Varchar columns must be wrapped by the LCASE() function, and string values must be delimited by simple quotes. For example, WHERE LCASE(NOME_IES) LIKE 'universidade%'",
				}
			},
			required : ["sql_select"]
		},
		description : `This function receives SELECT and WHERE clauses and queries a table for institutions and their location. The FROM clause SHOULD be IGNORED. The table columns are:
			NOME_IES: Institution NAME
			SIGLA_IES: Institution ACRONYM
			IN_CAPITAL: 1 if in a capital city, 0 otherwise
			NOME_MUNICIPIO: Institution CITY
			NOME_UF_IBGE: Institution STATE
			DESCR_REGIAO_IBGE: Institution REGION`
    }
]

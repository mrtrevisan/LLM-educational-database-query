import { runQuery } from "../../common/db/db2Client.js"

export const module = [
	// function
	{
		IESCountByRegion : async ( { regiao, uf } ) => {
			var select = 'SELECT COUNT(*)';

            var from = ''
            var where = ''

            if (uf) {
				var from = `
                FROM INEP.CENSO_IES ies
                INNER JOIN INEP.MUNICIPIOS_IBGE mu ON ies.COD_MUNICIPIO = mu.COD_IBGE
                INNER JOIN INEP.MICROREGIOES_IBGE mi ON mu.COD_MICROREGIAO_IBGE = mi.COD_MICROREGIAO_IBGE
                INNER JOIN INEP.MESOREGIOES_IBGE me ON mi.COD_MESOREGIAO_IBGE = me.COD_MESOREGIAO_IBGE 
                INNER JOIN INEP.UF_IBGE uf ON me.COD_UF_IBGE = uf.UF_IBGE
                `;
				
                var where = `
                WHERE NOME_UF_IBGE = '${uf}'
                `;
			} else if (regiao) {
                var from = `
                FROM INEP.CENSO_IES ies
                INNER JOIN INEP.MUNICIPIOS_IBGE mu ON ies.COD_MUNICIPIO = mu.COD_IBGE
                INNER JOIN INEP.MICROREGIOES_IBGE mi ON mu.COD_MICROREGIAO_IBGE = mi.COD_MICROREGIAO_IBGE
                INNER JOIN INEP.MESOREGIOES_IBGE me ON mi.COD_MESOREGIAO_IBGE = me.COD_MESOREGIAO_IBGE 
                INNER JOIN INEP.UF_IBGE uf ON me.COD_UF_IBGE = uf.UF_IBGE
                INNER JOIN INEP.REGIOES_IBGE re ON uf.COD_REGIAO_IBGE = re.COD_REGIAO_IBGE
                `;
				
                var where = `
                WHERE DESCR_REGIAO_IBGE = '${regiao}'
                `;
			} else {
                var from = `
                FROM INEP.CENSO_IES
                `;
            }

            const sql = `${select}${from}${where};`;

			console.log("IESCountRegion: ", sql);
			// console.log(sql);
			return { ...await runQuery(sql), filter : where };
		}
	},

	// Description
	{
		name: "IESCountByRegion",
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
		description : "Returns the count of institutions in the database, filtered by region or state. The region or state atributes must be in Brazillian Portuguese. Async function."
	}
]

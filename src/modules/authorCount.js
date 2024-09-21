export const func = {
	authorCount : async ( {nationality} ) => {
		if (!nationality) return {
			count: 1600,
			nationality: "none"
		}

		switch (nationality)
		{
			case 'brazillian':
				return {
					count: 500,
					nationality : nationality
				};
			case 'itallian':
				return {
					count: 300,
					nationality : nationality
				};
			case 'spanish':
				return {
					count: 800,
					nationality : nationality
				};
			default:
				return {
					count: null,
					nationality : nationality,
					error : "not in database"
				}		
		}
	}
}

// Description on the API module
export const decl = {
	name: "authorCount",
	parameters: {
		type: "OBJECT",
		description: "Get the author count by nationality, or an error message",
		properties: {
			nationality: {
				type: "STRING",
				description: "Nationality of the authors to count, can be any string or ommited, in which case will return the total count.",
			},
		},
		required: [],
	},
};

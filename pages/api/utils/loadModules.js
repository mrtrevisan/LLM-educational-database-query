// import * as mod0 from '../modules/IESCount.js';
// import * as mod1 from '../modules/IESList.js';
// import * as mod2 from '../modules/InstLocQuery.js';
import * as mod3 from '../modules/dbQuery.js';

const modules = [mod3] //[mod0, mod1, mod2];

export function loadModules()
{
    const functions = {};
    const declarations = [];

	for (const m of modules) {
		if (Array.isArray(m.module) && m.module.length == 2) {
			Object.assign(functions, m.module[0]);
			declarations.push(m.module[1]);
		} else {
			continue;
		}
	}

	return { functions : functions, declarations : declarations};
}

import fs from 'fs/promises';
import path from 'path';

// Dynamically loads all modules from the src/modules dir
export async function loadModules(modules_path)
{
	const modulesPath = path.join(process.cwd(), modules_path);

    const functions = {};
    const declarations = [];

	try {
		const files = await fs.readdir(modulesPath);

		const importPromises = files
			.filter(file => file.endsWith('.js'))
			.map(file => import(path.join(modulesPath, file)));

		const modules = await Promise.all(importPromises);

		for (const m of modules) {
			if (Array.isArray(m.module) && m.module.length == 2) {
				Object.assign(functions, m.module[0]);
				declarations.push(m.module[1]);
			} else {
				continue;
			}
		}

        return { functions : functions, declarations : declarations};
	} catch (e) {
		throw e;
	}
}
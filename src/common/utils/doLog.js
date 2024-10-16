import { once } from 'events';
import { createWriteStream } from 'fs';

export async function logToCsv(logPath, data)
{
    const stream = createWriteStream(logPath, { flags : 'a+' });

    const dataToLog = ( new Date().toLocaleString() + ";" + data.join(";") ).replace(/\n/g, '') + "\n"

    if (!stream.write(dataToLog)) 
        await once(stream, 'drain');

    stream.end();
    await once(stream, 'finish');
}

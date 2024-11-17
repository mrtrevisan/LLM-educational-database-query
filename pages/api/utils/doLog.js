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

export async function doLog(logPath, data)
{
    const stream = createWriteStream(logPath, { flags : 'a+' });

    const dataToLog = ( new Date().toLocaleString() + "\n" + JSON.stringify(data, null, '\t') + "\n" );

    if (!stream.write(dataToLog)) 
        await once(stream, 'drain');

    stream.end();
    await once(stream, 'finish');
}

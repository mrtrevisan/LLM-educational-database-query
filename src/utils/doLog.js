import { once } from 'events';
import { createWriteStream } from 'fs';

export async function logToCsv(data)
{
    const stream = createWriteStream("log.csv", { flags : 'a+' });

    if (!stream.write(new Date().toLocaleString() + ';' + data.join(';').replace('\n', '') + "\n")) 
        await once(stream, 'drain');

    stream.end();
    await once(stream, 'finish');
}

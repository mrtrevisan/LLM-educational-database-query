import ibmdb from 'ibm_db';

export const runQuery = async (sql) => {
    return new Promise((resolve, reject) => {
        const connStr = `DATABASE=${process.env.DB2_NAME};HOSTNAME=${process.env.DB2_HOST};UID=${process.env.DB2_USER};PWD=${process.env.DB2_PASS};PORT=${process.env.DB2_PORT};PROTOCOL=TCPIP`;
       
        ibmdb.open(connStr, (err, conn) => {
            if (err) {
                return reject(`Error opening connection: ${err}`);
            }
    
            conn.query(sql, (err, data) => {
                if (err) {
                    reject(`Query error: ${err}`);
                } else {
                    resolve(data);
                }
    
                conn.close((closeErr) => {
                    if (closeErr) {
                        console.error("Error closing connection: ", closeErr);
                    }
                });
            });
        });
    });
}

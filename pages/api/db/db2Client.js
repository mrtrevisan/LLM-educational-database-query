import ibmdb from 'ibm_db';

export const runQuery = async (sql) => {
    return new Promise((resolve, reject) => {
        const connStr = `DATABASE=${process.env.DB2_NAME};HOSTNAME=${process.env.DB2_HOST};UID=${process.env.DB2_USER};PWD=${process.env.DB2_PASS};PORT=${process.env.DB2_PORT};PROTOCOL=TCPIP`;
    
        ibmdb.open(connStr, (err, conn) => {
            if (err) {
                return reject(new Error(`Error opening connection: ${err.message}`));
            }
    
            conn.query(sql, (err, data) => {
                if (err) {
                    conn.close((closeErr) => {
                        if (closeErr) {
                            console.error("Error closing connection: ", closeErr);
                        }

                        return reject(new Error(`Query error: ${err.message}`));
                    });
                } else {
                    conn.close((closeErr) => {
                        if (closeErr) {
                            console.error("Error closing connection: ", closeErr);
                        }

                        resolve(data);
                    });
                }
            });
        });
    });
}

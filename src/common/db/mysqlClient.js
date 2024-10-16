import mysql from 'mysql2/promise';

function getPool()
{
    try
    {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        return pool;
    } 
    catch (e)
    {
        throw e;
    }
}

async function runQuery(sql_query)
{
    try
    {
        const pool = getPool();

        const [results, fields] = await pool.query(sql_query);

        return results;
    }
    catch (e)
    {
        throw e;
    }   
}

export { runQuery };

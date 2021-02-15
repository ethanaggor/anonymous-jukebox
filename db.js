// Using "as low as possible" tech requirements, which is the `pg` package (PostgreSQL's node-drivers).  Really doesn't get very much more "nuts-n-bolts" than this without manually using sockets to generate packets (and really, you'll probably never want to do that).

// For now, we'll use the basic singular PostgreSQL client (NOT the pool [pgpool], which we'll want to implement at a later time as our database requirements scale).
const { Client } = require('pg');

// DB URI pattern for Postgres is: `posgres://USERNAME:PASSWORD@DOMAIN:PORT/DBNAME`
const DB_URI = 'postgres://Nickatak:root@localhost/ethan';

const db = new Client(DB_URI);

db.connect();

//Really simple clear toggle.
const CLEAR_DB = true;

const createDB = () => {
    const dropAllTables = async () => {
        const query = `DROP SCHEMA public CASCADE;\
            CREATE SCHEMA public;\

            GRANT ALL ON SCHEMA public TO postgres;\
            GRANT ALL ON SCHEMA public TO public;`;
        db.query(query);
    }

    // Initial SQL Table creation for our models.
    const createUserTable = async () => {
        const query = `CREATE TABLE IF NOT EXISTS users (\
            id serial PRIMARY KEY,\
            email VARCHAR ( 100 ) UNIQUE NOT NULL,\
            password VARCHAR ( 255 ) NOT NULL,\
            first_name VARCHAR ( 50 ) NOT NULL,\
            last_name VARCHAR ( 50 ) NOT NULL,\
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
            is_admin BOOLEAN DEFAULT False\
            );`;

        db.query(query);
    }
    if (CLEAR_DB) {
        dropAllTables().then(() => createUserTable());
    }
}

createDB()
module.exports = db;




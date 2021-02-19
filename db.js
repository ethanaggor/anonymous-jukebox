// Using "as low as possible" tech requirements, which is the `pg` package (PostgreSQL's node-drivers).  Really doesn't get very much more "nuts-n-bolts" than this without manually using sockets to generate packets (and really, you'll probably never want to do that).

// For now, we'll use the basic singular PostgreSQL client (NOT the pool [pgpool], which we'll want to implement at a later time as our database requirements scale).
const { Client } = require('pg');

// DB URI pattern for Postgres is: `posgres://USERNAME:PASSWORD@DOMAIN:PORT/DBNAME`
const DB_URI = 'postgres://Nickatak:root@localhost/ethan';
var fs = require('fs');
const db = new Client(DB_URI);

db.connect();

//Really simple clear toggle.
const CLEAR_DB = false;

const createDB = () => {
    const dropAllTables = async () => {
        const query = `DROP SCHEMA public CASCADE;\
            CREATE SCHEMA public;\

            GRANT ALL ON SCHEMA public TO postgres;\
            GRANT ALL ON SCHEMA public TO public;`;
        db.query(query);
    };

    // Initial SQL Table creation for our models.
    const createUserTable = async () => {
        const query = `CREATE TABLE IF NOT EXISTS users (\
            id SERIAL PRIMARY KEY,\
            email VARCHAR ( 100 ) UNIQUE NOT NULL,\
            password VARCHAR ( 255 ) NOT NULL,\
            first_name VARCHAR ( 50 ) NOT NULL,\
            last_name VARCHAR ( 50 ) NOT NULL,\
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
            is_admin BOOLEAN DEFAULT False\
            );`;

        db.query(query);
    };

    const createFileTable = async () => {
        // There's some constraints here about file names that really need to be discussed.
        //             uploaded_by INT FORIEGN KEY REFERENCES users(id),\
        const query = `CREATE TABLE IF NOT EXISTS files (\
            uuid UUID PRIMARY KEY,\
            original_name VARCHAR ( 255 ) NOT NULL,\
            hash VARCHAR ( 255 ) NOT NULL,\
            extension VARCHAR ( 10 ) NOT NULL
            )`

        const UPLOAD_DIR = '/uploads';

        if (!fs.existsSync(UPLOAD_DIR)){
            fs.mkdirSync(UPLOAD_DIR);
        }
        db.query(query);
    };


    if (CLEAR_DB) {
        dropAllTables().then(() => {
            createUserTable();
            createFileTable();
        
        });
    }
    else {
        createUserTable();
        createFileTable();
    }
}

createDB()
module.exports = db;




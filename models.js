const db = require('./db');

// Required for file-hashing/file-saving functionality. 
const sha1 = require('js-sha1');
const { v4: uuidCreator } = require('uuid');
const fs = require('fs');
const path = require('path')
// I did NOT implement password hashing, so it'll be more straightforward for you at first.  We'll implement hashing later.


// While I could use a BaseModel here, I think doing it this way will allow you to write your own models based on what I've written below.
class User {

    async getAll() {
        // Get all the users.
        const query = 'SELECT * FROM users;';

        return this._extractRows(db.query(query));
    }

    async getById(id) {
        // Get a single user by their Primary Key.
        const query = 'SELECT * FROM users WHERE users.id = $1';

        return this._extractRows(db.query(query, [id]));
    }

    async create(email, password, first_name, last_name, is_admin) {
        // Create a new user.  This returns the id of the newly-created user.

        //WARNING!!! This is a currently UNSAFE, UNHASHED implementation, so you can learn what it does before we implement proper hashing with bcrypt.
        const query = 'INSERT INTO users (email, password, first_name, last_name, is_admin) VALUES ($1, $2, $3, $4, $5) RETURNING id;';

        return this._extractRows(db.query(query, [email, password, first_name, last_name, is_admin]));
    }

    async delete(id) {
        // Deletes a user by ID only.

        const query = 'DELETE FROM users WHERE users.id = $1';

        return this._extractRows(db.query(query, [id]));
    }

    async edit(id, email, password, first_name, last_name, is_admin) {
        // Edits a user by id only.  All fields must be supplied (We can worry about this later).

        const query = 'UPDATE users SET users.email = $2, users.password = $3, users.first_name = $4, users.last_name = $5, users.is_admin = $6 WHERE users.id = $1';

        return this._extractRows(db.query(query, [id, email, password, first_name, last_name, is_admin]))
    }

    async authenticate(email, password) {
        //WARNING!!! HASHING NOT IMPLEMENTED YET. THIS IS UNSAFE.  We will correct this with bcrypt later.
        const query = 'SELECT * FROM users WHERE users.email = $1 AND users.password = $2';

        return this._extractRows(db.query(query, [email, password]));
    } 

    _extractRows(queryPromise) {
        // Helper function to extract the rows only out of the resolved Promise of a pg-query.
        return queryPromise.then(data => data.rows);
    }
}


class File {
    constructor() {
        this.hasher = sha1.create();
        this.uploadDir = '/uploads';
    }

    getAll() {
        const query = `SELECT * FROM files`;

        return this._extractRows(db.query(query));
    }

    create(fileObj) {
        const hash = this._createHash(fileObj.data.slice(0, 1000));
        // new UUID4
        const uuid = uuidCreator();
        const originalName = fileObj.name;
        const ext = fileObj.name.split('.').pop();

        const query = `INSERT INTO files (uuid, original_name, hash, extension) VALUES ($1, $2, $3, $4);`;

        const writePath = path.join(__dirname + this.uploadDir, uuid + '.' + ext);
        this._writeFile(writePath, fileObj.data);
        return this._extractRows(db.query(query, [uuid, originalName, hash, ext]));
    }

    _writeFile(filePath, data) {
        fs.writeFile(filePath, data, () => {});
    }
    _createHash(byteString) {
        this.hasher.update(byteString);

        return this.hasher.hex();
    }

    _extractRows(queryPromise) {
        // Helper function to extract the rows only out of the resolved Promise of a pg-query.
        return queryPromise.then(data => data.rows);
    }
}



module.exports = {
    'User' : new User(),
    'File' : new File()
}
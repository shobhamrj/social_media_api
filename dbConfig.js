const pgp = require('pg-promise')();
const connection = {
    host: 'localhost',
    port: 5432,
    database: 'social_media',
    user: 'shobham',
    password: '',
    allowExitOnIdle: true
};
const db = pgp(connection);

module.exports = db;

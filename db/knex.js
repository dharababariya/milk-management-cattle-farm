const environment = process.env.ENVIRONMENT || 'development'
const config = require('../knexfile.js')[environment];
module.exports = require('knex')(config);
// var knex = require("knex")({
//     client: "pg",
//     connection: {
//         host: "localhost",
//         user: "postgres",
//         password: "2000",
//         database: "postgres",
//     },
// });

// module.exports = knex;

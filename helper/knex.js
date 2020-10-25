var knex = require('knex')({
    client: 'pg',
    connection: {
      host : 'localhost',
      user : 'postgres',
      password : '2000',
      database : 'postgres'
    }
  });

module.exports =knex;
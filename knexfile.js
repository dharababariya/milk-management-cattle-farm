// Update with your config settings.

module.exports = {
    development: {
        client: "sqlite3",
        connection: {
            filename: "./dev.sqlite3",
        },
        migrations: {
            directory: __dirname + "/db/migrations",
        },
        seeds: {
            directory: __dirname + "/db/seeds/dev",
        },
        useNullAsDefault: true,
    },

    staging: {
        client: "pg",
        connection: {
            host: "localhost",
            user: "postgres",
            password: "2000",
            database: "postgres",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: __dirname + "/db/migrations",
        },
        seeds: {
            directory: __dirname + "/db/seeds",
        },
    },

    production: {
        client: "postgresql",
        connection: {
            database: "my_db",
            user: "username",
            password: "password",
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: "knex_migrations",
        },
    },
};

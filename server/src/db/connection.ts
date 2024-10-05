import knex from 'knex';

const config = process.env;

const pg = knex({
    client: 'pg',
    connection: {
        host: config.PGSQL_HOST,
        port: Number(config.PGSQL_PORT),
        user: config.PGSQL_USER,
        password: config.PGSQL_PWD,
        database : config.PGSQL_DB,
        ssl: config.DB_SSL ? { rejectUnauthorized: false } : false,
    },
});

export default pg;
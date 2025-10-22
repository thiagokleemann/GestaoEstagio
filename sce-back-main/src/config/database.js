import "dotenv/config";

const databaseConfig = {
    dialect: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DBNAME,
    port: process.env.DB_PORT,
    logging: false,
    timezone: "-03:00",
    define: {
        timestamps: true,
        underscored: false,
        freezeTableName: true,
    },
    // dialectOptions: {
    //     ssl: {
    //         require: process.env.DB_SSL,
    //         rejectUnauthorized: false,
    //     },
    //     statement_timeout: 100000000,
    // },
};

export default databaseConfig;

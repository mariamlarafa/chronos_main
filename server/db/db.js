// db.js
import cls from 'cls-hooked';
import { Sequelize } from "sequelize";
import { config } from "../environment.config.js";
import logger from "../log/config.js";
// Initialize Sequelize with your database connection details
//for test purposes use
/**
 const sequelize = new Sequelize('chronos', 'root', '', {
 */
const namespace =cls.createNamespace("chronos-namespace")

Sequelize.useCLS(namespace)
const sequelize = new Sequelize(
  config.db_name,
  config.db_user,
  config.db_password,
  {
    host: config.db_host,
    port: config.db_port,
    dialect: "mysql",
    logging: (sql, timing) => {
      // You can use your custom logger here
      if (config.env_dev){
        logger.info(`SQL Query: ${sql}`);
        logger.info(`Execution Time: ${Number(timing)}ms`);

      }
    },
    dialectOptions: {
      connectTimeout: 600000, // Adjust based on your requirements (60 seconds in this example)
    },
    // pool: {
    //   max: 100000,
    //   min: 0,
    //   acquire: 30000,
    //   idle: 100000,
    // },

    //   retry: {
    //     max: 10, // Number of times to retry connecting
    //   },



  }
);

// Test the connection
async function connect() {
  try {
    await sequelize.authenticate();
    // console.log('Database connection has been established successfully.');
    logger.debug("db connexion successful !!");
    // return sequelize
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

connect();

export default sequelize;

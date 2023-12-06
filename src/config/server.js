require("dotenv").config();

const { Client } = require("pg");

const connection = new Client({
  user: process.env.MYSQL_USERNAME,
  host: process.env.MYSQL_HOSTNAME,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
  port: process.env.MYSQL_PORT,
});

// Conectar ao banco de dados
connection.connect()
  .then(() => console.log('Conectado ao PostgreSQL'))
  .catch(err => console.error('Erro de conexão:', err));

// var connection = pg.createPool({
//   port: process.env.MYSQL_PORT,
//   host: process.env.MYSQL_HOSTNAME,
//   user: process.env.MYSQL_USERNAME,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   insecureAuth: true,
// });

module.exports = connection;

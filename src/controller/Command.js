const connection = require("@server");
const Insert = require("@insert");
const logger = require("@logger");

const Command = {
  async findOne(id_equipamento) {
    logger.info("Get Command");

    console.log(id_equipamento);

    const queryConsult = `select * from mqtt.comandos where id_equipamento = ${id_equipamento};`;

    console.log(queryConsult);

    await connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Command: ", error);
        return { error: error };
      } else {
        // console.log("Resultados Find equipamento");
        console.log(results.rows);
        console.log("============================");
        return results.rows;
      }
    });
    // connection.end();
  },

  async find(req, res) {
    logger.info("Get Command");

    const query = `select * from mqtt.comandos;`;

    connection.query(query, async (error, results, fields) => {
      if (error) {
        console.log("Error Select Command: ", error);
        return res.status(500).json({ message: "Erro ao listar Comandos" });
      } else {
        console.log("Response Command");
        console.log(results.rows);
        return res.json(results.rows);
      }
    });
  },

  async create(req, res) {
    logger.info("Post Command");

    const params = req.body;

    console.log(params);

    Insert(params)
      .then(async (resp) => {
        return res.json(resp);
      })
      .catch((error) => {
        return res.error(error);
      });
  },
};

module.exports = Command;

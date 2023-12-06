const connection = require("@server");
const Insert = require("@insert");
const logger = require("@logger");

const Floor = {
  async find(req, res) {
    logger.info("Get Floor");

    const queryConsult = "select * from mqtt.salas";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Floor: ", error);
      } else {
        console.log(results.rows);
        return res.json(results.rows);
      }
    });
    // connection.end();
  },

  async create(req, res) {
    logger.info("Post Floor");

    const params = req.body;

    console.log(params);

    Insert(params)
      .then(async (resp) => {
        return res.json(resp);
      })
      .catch((error) => {
        return res.json(error);
      });
  },

  async delete(req, res) {
    const { id } = req.params;

    const query = `delete from mqtt.relacao where id_sala = ${id}; delete from mqtt.salas where id = ${id}`;

    connection.query(query, async (error, results, fields) => {
      if (error) {
        console.log("Error Select Equipament: ", error);
      } else {
        return res.status(200).json(results);
      }
    });
  },
};

module.exports = Floor;

const connection = require("@server");
const Insert = require("@insert");
const logger = require("@logger");
// const Command = require("@controller/Command");

const User = {
  async find(req, res) {
    logger.info("Get User");

    const queryConsult = `select * from mqtt.usuario`;

    connection.query(queryConsult, async (error, results, fields) => {
      if (error) {
        console.log("Error Select User: ", error);
      } else {
        console.log("Response User");
        console.log(results.rows);
        return res.json(results.rows);
      }
    });
  },

  async create(req, res) {
    logger.info("Post User");

    console.log(req.body);
    const params = req.body;
    Insert(params)
      .then(async (resp) => {
        return res.status(200).json(resp);
      })
      .catch((error) => {
        return res.status(400).json(error);
      });
  },

  async login(req, res) {
    logger.info("Login User");

    const params = req.body;

    const queryConsult = `select * from mqtt.usuario where email like '${params.email}' and senha like '${params.password}';`;

    console.log(queryConsult);

    connection.query(queryConsult, async (error, results, fields) => {
      if (error) {
        console.log("Error Select User: ", error);
      } else {
        console.log("Response User");
        try {
          console.log(results.rows);
          results.rows[0].senha = true;
          return res.json(results.rows[0]);
        } catch (error) {
          return res.status(400).json(error);
        }
      }
    });
  },
};

module.exports = User;

const connection = require("@server");
const Insert = require("@insert");
const logger = require("@logger");
// const Command = require("@controller/Command");

const Protocol = {
  async find(req, res) {
    logger.info("Get Protocol");

    const { id_sala } = req.params;

    const queryConsult = `select * from mqtt.protocolo;`;

    connection.query(queryConsult, async (error, results, fields) => {
      if (error) {
        console.log("Error Select Protocol: ", error);
      } else {
        console.log("Response Protocol");
        console.log(results.rows);
        return res.json(results.rows);
      }
    });
  },

  async create(req, res) {
    logger.info("Post Protocol");

    console.log(req.body);
    const params = req.body;
    const { id_sala } = params;
    // const { commands } = params.data;

    delete params.id_sala;
    delete params.data.commands;

    // console.log(commands);

    Insert(params)
      .then(async (resp) => {
        const data = {
          data: {
            id: Math.floor(Math.random() * 1000),
            id_sala: id_sala,
            id_Protocolo: resp.rows[0].id,
          },
          table: "mqtt.relacao",
        };

        Insert(data).then((response) => {
          console.log(response);
        });

        // for (let index = 0; index < commands.length; index++) {
        //   (commands[index].id = Math.floor(Math.random() * 1000)), (commands[index].id_Protocolo = resp.rows[0].id);
        //   const element = commands[index];
        //   Command.create({ data: element, table: "mqtt.comandos" });
        // }
        return res.json(resp);
      })
      .catch((error) => {
        return res.json(error);
      });
  },

  async power(req, res) {
    const { id_sala } = req.params;

    const query = `select c.id_Protocolo, c.comando from mqtt.comandos c join mqtt.Protocolo e on e.id = c.id_Protocolo join mqtt.relacao r on r.id_Protocolo = e.id join mqtt.salas s on s.id = r.id_sala where s.id = ${id_sala}`;

    connection.query(query, async (error, results, fields) => {
      if (error) {
        console.log("Error Select Protocol: ", error);
      } else {
        return res.json(results.rows);
      }
    });
  },
};

module.exports = Protocol;

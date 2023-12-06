const connection = require("@server");
const Insert = require("@insert");
const logger = require("@logger");
const Command = require("@controller/Command");

const Equipament = {
  async find(req, res) {
    logger.info("Get Equipament");

    const { id_sala } = req.params;

    const queryConsult = `select e.id, e.modelo, e.descricao, e.marca, e.id_protocolo from mqtt.equipamento e join mqtt.relacao r  on r.id_equipamento = e.id where r.id_sala = ${id_sala};`;

    connection.query(queryConsult, async (error, results, fields) => {
      if (error) {
        console.log("Error Select Equipament: ", error);
      } else {
        const responseAPI = await new Promise(async function (resolve, reject) {
          for (let index = 0; index < results.rows.length; index++) {
            const equipamento = results.rows[index];
            const secondQuery = `select c.* from mqtt.comandos c join mqtt.protocolo p on p.id = c.id_protocolo join mqtt.equipamento e on e.id_protocolo = p.id where e.id = ${equipamento.id}`;
            const iteration = await new Promise(async (resolve, reject) => {
              await connection.query(secondQuery, function (error, resultsCommands, fields) {
                if (error) {
                  logger.error(error);
                  return reject(error);
                }
                results.rows[index].comandos = resultsCommands.rows;
                return resolve();
              });
            });
          }
          return resolve();
        });
        return res.json(results.rows);
      }
    });
  },

  async create(req, res) {
    logger.info("Post Equipament");

    console.log(req.body);
    const params = req.body;
    const { id_sala } = params;
    const { commands } = params.data;

    delete params.id_sala;
    delete params.data.commands;

    console.log(commands);

    Insert(params)
      .then(async (resp) => {
        const data = {
          data: {
            id: Math.floor(Math.random() * 1000),
            id_sala: id_sala,
            id_equipamento: resp.rows[0].id,
          },
          table: "mqtt.relacao",
        };
        Insert(data).then((response) => {
          console.log(response);
        });
        for (let index = 0; index < commands.length; index++) {
          (commands[index].id = Math.floor(Math.random() * 1000)), (commands[index].id_equipamento = resp.rows[0].id);
          const element = commands[index];
          Command.create({ data: element, table: "mqtt.comandos" });
        }
        return res.json(resp);
      })
      .catch((error) => {
        return res.json(error);
      });
  },

  async power(req, res) {
    const { id_sala } = req.params;

    const query = `select c.id_equipamento, c.comando from mqtt.comandos c join mqtt.equipamento e on e.id = c.id_equipamento join mqtt.relacao r on r.id_equipamento = e.id join mqtt.salas s on s.id = r.id_sala where s.id = ${id_sala}`;

    connection.query(query, async (error, results, fields) => {
      if (error) {
        console.log("Error Select Equipament: ", error);
      } else {
        return res.json(results.rows);
      }
    });
  },

  async delete(req, res) {
    const { id } = req.params;

    const query = `delete from mqtt.relacao where id_equipamento = ${id}; delete from mqtt.equipamento where id = ${id}`;

    connection.query(query, async (error, results, fields) => {
      if (error) {
        console.log("Error Select Equipament: ", error);
      } else {
        return res.status(200).json(results);
      }
    });
  },
};

module.exports = Equipament;

const connection = require("@server");
const Insert = require("@insert");
const Mqtt = require("@controller/Mqtt");
const logger = require("@logger");
const cron = require("node-cron");

const diasDaSemana = ["domingo", "segundafeira", "terçafeira", "quartafeira", "quintafeira", "sextafeira", "sábado"];

async function gravarAgenda(hora, minuto, mensagem, topico) {
  console.log(`Tarefa agendada: ${hora}:${minuto}`);
  cron.schedule(`${minuto} ${hora} * * *`, () => {
    console.log(`Tarefa agendada executada! ${hora}:${minuto}`);
    console.log(topico);
    console.log(mensagem);
    Mqtt.agendaPublishTopic(mensagem, topico);
  });
  return;
}

const Schedule = {
  async find(req, res) {
    logger.info("Get Schedule");

    const { id_sala } = req.params;

    const queryConsult = `select * from mqtt.agenda where id_sala = ${id_sala};`;

    connection.query(queryConsult, async (error, results, fields) => {
      if (error) {
        console.log("Error Select Schedule: ", error);
      } else {
        console.log("Response Schedule");
        console.log(results.rows);
        return res.json(results.rows);
      }
    });
  },

  async create(req, res) {
    logger.info("Post Schedule");

    console.log(req.body);
    const params = req.body;

    const hora = params.data.hora_inicio.split(":")[0];
    const minuto = params.data.hora_inicio.split(":")[1];

    await gravarAgenda(hora, minuto);

    Insert(params)
      .then(async (resp) => {
        const data = {
          data: {
            id: Math.floor(Math.random() * 1000),
            id_sala: id_sala,
            id_schedule: resp.rows[0].id,
          },
          table: "mqtt.relacao",
        };

        Insert(data).then((response) => {
          console.log(response);
        });

        // for (let index = 0; index < commands.length; index++) {
        //   (commands[index].id = Math.floor(Math.random() * 1000)), (commands[index].id_Scheduleo = resp.rows[0].id);
        //   const element = commands[index];
        //   Command.create({ data: element, table: "mqtt.comandos" });
        // }
        return res.json(resp);
      })
      .catch((error) => {
        return res.json(error);
      });
  },

  async createAll(req, res) {
    logger.info("Post Schedule");

    const agora = new Date();
    const diaAtual = agora.getDay();

    const query = `select s.descricao as sala, a.hora_inicio, a.hora_fim, e.id, 
      (select comando from mqtt.comandos
      where id_protocolo = e.id_protocolo 
      and descricao like 'Ligar') as ligar,
      (select comando from mqtt.comandos
      where id_protocolo = e.id_protocolo 
      and descricao like 'Desligar') as desligar
      from mqtt.agenda a
      join mqtt.salas s on s.id = a.id_sala 
      join mqtt.relacao r on r.id_sala = s.id 
      join mqtt.equipamento e on e.id = r.id_equipamento 
      where REPLACE(LOWER(dia), '-', '') like '${diasDaSemana[diaAtual]}%'
      `;

    console.log(query);

    connection.query(query, async (error, results, fields) => {
      if (error) {
        console.log("Error Get Schedules: ", error);
      } else {
        console.log(results.rows);
        let hora = "";
        let minuto = "";
        const resPromise = await new Promise(async function (resolve, reject) {
          for (let index = 0; index < results.rows.length; index++) {
            const element = results.rows[index];
            hora = element.hora_inicio.split(":")[0];
            minuto = element.hora_inicio.split(":")[1];

            const ligar = element.ligar;
            const desligar = element.desligar;
            const topico = element.sala.replaceAll(" ", "").toLowerCase();

            await gravarAgenda(hora, minuto, ligar, topico);

            hora = element.hora_fim.split(":")[0];
            minuto = element.hora_fim.split(":")[1];
            await gravarAgenda(hora, minuto, desligar, topico);
          }
          resolve();
        });
        return res.json(results.rows);
      }
    });
  },

  async import(req, res) {
    logger.info("Post Import");

    const params = req.body;

    const insertValues = params.data.map((json, index) => {
      return `('${json.Dia_Semana}', '${json.Hora_Inicio}', '${json.Hora_Fim}', '${json.Disciplina}', '${json.Sala}')`;
    });

    const sqlStatement = `INSERT INTO ${params.table} (Dia_Semana, Hora_Inicio, Hora_Fim, Disciplina, Sala) VALUES ${insertValues.join(", ")};`;

    console.log(sqlStatement);

    connection.query(sqlStatement, async (error, results, fields) => {
      if (error) {
        console.log("Error Select Schedule: ", error);
      } else {
        console.log("Response Schedule");
        console.log(results.rows);
        return res.json(results.rows);
      }
    });
  },
};

module.exports = Schedule;

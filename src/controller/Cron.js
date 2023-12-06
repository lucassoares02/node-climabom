const connection = require("@server");
const Insert = require("@insert");
const logger = require("@logger");
const mqtt = require("mqtt");
const cron = require("node-cron");

async function gravarAgenda(hora, minuto) {
  console.log(`Tarefa agendada: ${hora}:${minuto}`);
  cron.schedule(`${minuto} ${hora} * * *`, () => {
    console.log("Tarefa agendada executada!");
    console.log(new Date());
    console.log("==================================================");
    // Coloque o código da sua tarefa aqui
  });
  return;
}

const Cron = {
  async start(req, res) {
    logger.info("Get Cron");

    const { hora, minuto } = req.params;

    console.log(new Date());
    await gravarAgenda(hora, minuto);
    return res.json({});
  },

  async find(req, res) {
    logger.info("Get Tasks");

    const tarefasAgendadas = cron.getTasks();
    console.log("Tarefas Agendadas:");
    console.log(tarefasAgendadas);
    tarefasAgendadas.forEach((tarefa) => {
      console.log(`Nome: ${tarefa.name}, Cron: ${tarefa.cron}`);
    });
    return res.json({ tarefas: tarefasAgendadas });
  },
};

module.exports = Cron;

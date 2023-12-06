const connection = require("@server");
const Insert = require("@insert");
const logger = require("@logger");
const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://172.18.7.1:1883");
let teste = "";
const topic = "";

// client.on("connect", () => {
//   client.subscribe(topic, (err) => {
//     if (!err) {
//       console.log(`Inscrito no tópico: ${topic}`);
//     }
//   });
// });

// // Lidere com mensagens recebidas no tópico
// client.on("message", (topic, message) => {
//   console.log(`Mensagem recebida no tópico ${topic}: ${message.toString()}`);
//   teste = message.toString();
//   // Faça o que for necessário com a mensagem recebida
// });

const Publish = {
  async publishTopic(req, res) {
    logger.info("Get Publish");

    const { message, topic } = req.params;

    console.log(topic);
    console.log(message);

    try {
      client.publish(`cmnd/${topic}/IRSEND`, message);
      return res.json({ message: "true" });
    } catch (error) {
      console.log(`Erro ao publicar tópico: ${error}`);
    }
  },

  async agendaPublishTopic(message, topic) {
    logger.info("Get Publish");

    console.log(topic);
    console.log(message);

    try {
      client.publish(`cmnd/${topic}/IRSEND`, message);
      return { message: "true" };
    } catch (error) {
      console.log(`Erro ao publicar tópico: ${error}`);
      return error;
    }
  },

  async publishOffCulix(req, res) {
    logger.info("Get Publish");

    const { message } = req.params;

    console.log(message);

    try {
      client.publish("cmnd/climabom/IRSEND", message);
      return res.json({ message: "true" });
    } catch (error) {
      console.log(`Erro ao publicar tópico: ${error}`);
    }
  },

  async subscribeTopic(req, res) {
    // Lidere com mensagens recebidas no tópico
    const { topic } = req.body;
    console.log(topic);
    teste = topic;
    return res.json(teste);
    // client.on("message", (topic, message) => {
    //   console.log(`Mensagem recebida no tópico ${topic}: ${message.toString()}`);
    //   // Faça o que for necessário com a mensagem recebida
    //   return res.json(message);
    // });
    // Conecte-se ao servidor MQTT
  },
};

module.exports = Publish;

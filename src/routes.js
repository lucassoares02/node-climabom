const router = require("express").Router();
const Floor = require("@controller/Floor");
const Equipament = require("@controller/Equipament");
const Protocol = require("@controller/Protocol");
const Schedule = require("@controller/Schedule");
const User = require("@controller/User");
const Command = require("@controller/Command");
const Mqtt = require("@controller/Mqtt");
const Cron = require("@controller/Cron");

// Methods User
// getUsuarios.php
router.get("/floor", Floor.find);
router.post("/floor", Floor.create);
router.delete("/floor/:id", Floor.delete);

router.get("/equipament/:id_sala", Equipament.find);
router.post("/equipament", Equipament.create);
router.delete("/equipament/:id", Equipament.delete);

router.get("/protocols", Protocol.find);

router.get("/command", Command.find);
router.post("/command", Command.create);

router.get("/publicar/:message/:topic", Mqtt.publishTopic);
router.get("/publicarOff/:message", Mqtt.publishOffCulix);
router.post("/subscribe", Mqtt.subscribeTopic);

router.post("/agenda", Schedule.create);
router.get("/agenda/:id_sala", Schedule.find);
router.get("/agendar", Schedule.createAll);
router.post("/import", Schedule.import);

router.post("/register", User.create);
router.post("/login", User.login);

router.get("/cron/:hora/:minuto", Cron.start);
router.get("/tasks", Cron.find);

module.exports = router;

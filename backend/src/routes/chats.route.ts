const express = require("express");
const router = express.Router();
const { chatHandler, getChats } = require("../controllers/chats.controller");

router.get("/history/:userId", getChats);
router.post("/chat-handler", chatHandler);


module.exports = router;

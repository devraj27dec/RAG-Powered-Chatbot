const express = require("express");
const router = express.Router();
const { chatHandler, getChats , deleteChats} = require("../controllers/chats.controller");

router.get("/history/:sessionId", getChats);
router.post("/chat-handler", chatHandler);
router.delete("/history/:sessionId", deleteChats)


module.exports = router;

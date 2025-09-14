const mysqlPool = require("../config/database");
const {sendPrompt} = require("../config/bot");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */


async function chatHandler(req: any, res: any) {
  let { sessionId, message } = req.body;

  console.log("Received chat request:", { sessionId, message });

  if (!sessionId || !message) {
    return res.status(400).json({ error: "sessionId and message required" });
  }

  try {
    const botResponse = await sendPrompt(message);

    const connection = await mysqlPool.getConnection();
    try {
      await connection.execute(
        "INSERT INTO chats (session_id, user_message, bot_response) VALUES (?, ?, ?)",
        [sessionId, message, botResponse]
      );
    } finally {
      connection.release();
    }

    res.json({ reply: botResponse });
  } catch (err) {
    console.error("Chat handler error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}



const getChats = async (req: any, res: any) => {
  try {
    const sessionId = req.params.sessionId || req.body.sessionId;

    const db = await mysqlPool.getConnection();
    const query =
      "SELECT * FROM chats WHERE session_id = ? ORDER BY created_at ASC";

    const [rows] = await db.execute(query, [sessionId]);
    db.release();

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};


const deleteChats = async (req: any, res: any) => {
  const sessionId = req.params.sessionId || req.body.sessionId; 

  const db = await mysqlPool.getConnection();
  const query = "DELETE FROM chats WHERE session_id = ?";
  const [result] = await db.execute(query, [sessionId]);
  db.release();

  res.status(200).json({ message: "Chats deleted successfully", result });
};



module.exports = { chatHandler, getChats , deleteChats }; 
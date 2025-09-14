const mysqlPool = require("../config/database");
const {sendPrompt} = require("../config/bot");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */



async function chatHandler(req:any, res:any) {
    let { userId, message } = req.body;

  console.log("Received chat request:", { userId, message });

  userId = Number(userId);

  if (!userId || !message) {
    return res.status(400).json({ error: "userId and message required" });
  }

  try {
    console.log("Processing message for user:", userId);
    console.log("Message content:", message);

    const botResponse = await sendPrompt(message);
    console.log("Bot response:", botResponse);

   const connection = await mysqlPool.getConnection();
    try {
        await connection.execute(
        "INSERT INTO chats (user_id, user_message, bot_response) VALUES (?, ?, ?)",
        [userId, message, botResponse]
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
    const userId = req.params.userId || req.body.userId; 

    const db = await mysqlPool.getConnection();
    const query =
      "SELECT * FROM chats WHERE user_id = ? ORDER BY created_at DESC LIMIT 50";

    const [rows] = await db.execute(query, [userId]);

    db.release();

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

module.exports = { chatHandler, getChats }; 
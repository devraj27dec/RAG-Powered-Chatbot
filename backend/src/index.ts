require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const mysqlPool = require("./config/database");
const user = require("./routes/user.route");
const chats = require("./routes/chats.route");

app.use(express.json()); 
app.use(cors())

app.get("/", (req: any, res: any) => {
  res.send("Hello World!");
});


app.use('/api/users', user);
app.use('/api/chats', chats);


async function initDbAndServer() {
  try {
    const connection = await mysqlPool.getConnection();
    console.log("✅ Connected to MySQL Database");
    connection.release();

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Error connecting to the database:", err);
    process.exit(1);
  }
}

initDbAndServer();

const mysqlPool = require("../config/database");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const registerUser = async (req:any, res:any) => {
  const { username, email } = req.body;

  try {
    const connection = await mysqlPool.getConnection();
    const [result] = await connection.execute(
      "INSERT INTO users (username, email) VALUES (?, ?)",
      [username, email]
    );
    connection.release();

    res.status(201).json({ message: "User registered", userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register user" });
  }
};

module.exports = registerUser; // ✅ export the function directly

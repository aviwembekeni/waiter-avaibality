module.exports = function(pool) {
  async function getWeekdays() {
    const weekdays = await pool.query("SELECT * FROM weekdays");
    return weekdays.rows;
  }

  async function addUser(username = "", fullname = "", usertype = "") {
    if ((username !== "" && fullname !== "") || username !== "") {
      await pool.query(
        "INSERT INTO users (user_name, full_name, user_type) VALUES ( $1, $2, $3)",
        [username, fullname, usertype]
      );
    }
  }

  async function getUsers() {
    const users = await pool.query("SELECT * FROM users");

    return users.rows;
  }

  async function addShift(username, day) {
    const userIds = await pool.query(
      "SELECT id from users WHERE user_name= $1",
      [username]
    );

    const dayIds = await pool.query(
      "SELECT id from weekdays WHERE day_name= $1",
      [day]
    );

    const userId = userIds.rows[0].id;
    const dayId = dayIds.rows[0].id;

    await pool.query(
      "INSERT INTO shifts (waiter_id, weekday_id) VALUES ( $1, $2)",
      [userId, dayId]
    );
  }

  async function getShifts() {
    const shifts = await pool.query("SELECT * FROM shifts");

    return shifts.rows;
  }

  async function getUserType(username) {
    if (username !== "") {
      const userType = await pool.query(
        "SELECT user_type from users WHERE user_name = $1",
        [username]
      );

      if (userType.rowCount !== 0) {
        return userType.rows[0].user_type;
      } else {
        return "";
      }
    }
  }

  return {
    getWeekdays,
    addUser,
    getUsers,
    addShift,
    getShifts,
    getUserType
  };
};

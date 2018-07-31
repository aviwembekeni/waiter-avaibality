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

    let weekday_ids = [];

    for (let i = 0; i < day.length; i++) {
      const dayIds = await pool.query(
        "SELECT id from weekdays WHERE day_name= $1",
        [day[i]]
      );

      let id = dayIds.rows[0].id;

      weekday_ids.push(id);
    }

    const userId = userIds.rows[0].id;

    for (let i = 0; i < weekday_ids.length; i++) {
      await pool.query(
        "INSERT INTO shifts (waiter_id, weekday_id) VALUES ( $1, $2)",
        [userId, weekday_ids[i]]
      );
    }
  }

  async function getShifts() {
    const shifts = await pool.query(
      "SELECT day_name, full_name FROM shifts JOIN users ON shifts.waiter_id = users.id JOIN weekdays ON shifts.weekday_id = weekdays.id"
    );
    const sortedShifts = [
      {
        id: 1,
        day_name: "Monday",
        shifts: [],
        color: ""
      },
      {
        id: 2,
        day_name: "Tuesday",
        shifts: [],
        color: ""
      },
      {
        id: 3,
        day_name: "Wednesday",
        shifts: [],
        color: ""
      },
      {
        id: 4,
        day_name: "Thursday",
        shifts: [],
        color: ""
      },
      {
        id: 5,
        day_name: "Friday",
        shifts: [],
        color: ""
      },
      {
        id: 6,
        day_name: "Saturday",
        shifts: [],
        color: ""
      },
      {
        id: 7,
        day_name: "Sunday",
        shifts: [],
        color: ""
      }
    ];

    shifts.rows.forEach(shift => {
      sortedShifts.forEach(sortedShifts => {
        if (shift.day_name == sortedShifts.day_name) {
          sortedShifts.shifts.push(shift.full_name);
        }
        if (sortedShifts.shifts.length == 3) {
          sortedShifts.color = "green";
        } else if (sortedShifts.shifts.length > 3) {
          sortedShifts.color = "blue";
        }
      });
    });

    return sortedShifts;
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

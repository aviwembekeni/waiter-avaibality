"Use strict";
var assert = require("assert");
const pg = require("pg");
const Pool = pg.Pool;

let useSSL = false;
if (process.env.DATABASE_URL) {
  useSSL = true;
}

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://aviwe:aviwe@localhost:5432/waiter_availability_tests",
  ssl: useSSL
});

const WaiterAvailability = require("../waiter-availability");

describe("getWeekdays", function() {
  it("should return weekdays", async function() {
    let waiterAvail = WaiterAvailability(pool);

    const weekdays = [
      { id: 1, day_name: "Monday" },
      { id: 2, day_name: "Tuesday" },
      { id: 3, day_name: "Wednesday" },
      { id: 4, day_name: "Thursday" },
      { id: 5, day_name: "Friday" },
      { id: 6, day_name: "Saturday" },
      { id: 7, day_name: "Sunday" }
    ];

    assert.deepEqual(weekdays, await waiterAvail.getWeekdays());
  });
});

describe("addUser", function() {
  it("should add a user", async function() {
    let waiterAvail = WaiterAvailability(pool);

    const users = [
      {
        id: 1,
        user_name: "johnwick",
        full_name: "John Wick",
        user_type: "waiter"
      },
      {
        id: 2,
        user_name: "johndoe",
        full_name: "John Doe",
        user_type: "waiter"
      },
      {
        id: 3,
        user_name: "aviwembekeni",
        full_name: "Aviwe Mbekeni",
        user_type: "admin"
      },
      {
        id: 4,
        user_name: "klaus",
        full_name: "Nicklaus Mikaelson",
        user_type: "waiter"
      }
    ];

    await waiterAvail.addUser("klaus", "Nicklaus Mikaelson", "waiter");

    assert.deepEqual(users, await waiterAvail.getUsers());
  });
});

describe("addShift", function() {
  it("should add shifts", async function() {
    let waiterAvail = WaiterAvailability(pool);

    await waiterAvail.addShift("johndoe", "Saturday");

    let results = await pool.query(
      "SELECT user_name, day_name FROM users JOIN shifts ON users.id = shifts.waiter_id JOIN weekdays ON shifts.weekday_id = weekdays.id WHERE user_name = $1 AND day_name = $2",
      ["johndoe", "Thursday"]
    );

    assert.notEqual(0, results.rowCount);
  });
});

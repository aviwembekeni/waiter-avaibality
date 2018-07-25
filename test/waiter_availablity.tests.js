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

const WaiterAvailability = require("../waiter-availablity");

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

    /*const shiftList = [
      { id: 1, waiter_id: 1, weekday_id: 1 },
      { id: 2, waiter_id: 1, weekday_id: 2 },
      { id: 3, waiter_id: 1, weekday_id: 3 },
      { id: 4, waiter_id: 2, weekday_id: 3 },
      { id: 5, waiter_id: 2, weekday_id: 4 },
      { id: 6, waiter_id: 2, weekday_id: 5 },
      { id: 7, waiter_id: 3, weekday_id: 5 },
      { id: 8, waiter_id: 3, weekday_id: 6 },
      { id: 9, waiter_id: 3, weekday_id: 7 },
      { id: 10, waiter_id: 2, weekday_id: 4 }
    ];*/

    await waiterAvail.addShift("johndoe", "Thursday");

    let waiter_ids = await pool.query(
      "SELECT id from users WHERE user_name = $1",
      ["johndoe"]
    );

    let weekday_ids = await pool.query(
      "SELECT id from weekdays WHERE day_name = $1",
      ["Thursday"]
    );

    let waiter_id = waiter_ids.rows[0].id;
    let weekday_id = weekday_ids.rows[0].id;

    let shifts = await pool.query(
      "select * from shifts WHERE waiter_id = $1 and weekday_id = $2",
      [waiter_id, weekday_id]
    );

    let shift = shifts.rows[0];

    assert.equal(waiter_id, shift.waiter_id);
    assert.equal(weekday_id, shift.weekday_id);
  });
});

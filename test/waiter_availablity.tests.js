"Use strict";
const assert = require("assert");
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
  beforeEach(async function() {
    await pool.query("delete from shifts");
    await pool.query("delete from users");
  });

  it("should return weekdays", async function() {
    let waiterAvail = WaiterAvailability(pool);

    const weekdays = [
      {
        day_name: "Monday",
        id: 1
      },
      {
        day_name: "Tuesday",
        id: 2
      },
      {
        day_name: "Wednesday",
        id: 3
      },
      {
        day_name: "Thursday",
        id: 4
      },
      {
        day_name: "Friday",
        id: 5
      },
      {
        day_name: "Saturday",
        id: 6
      },
      {
        day_name: "Sunday",
        id: 7
      }
    ];

    assert.deepEqual(await waiterAvail.getWeekdays(), weekdays);
  });
});

describe("addShift", function() {
  beforeEach(async function() {
    await pool.query("delete from shifts");
    await pool.query("delete from users");
  });

  it("should add shifts", async function() {
    let waiterAvail = WaiterAvailability(pool);

    await waiterAvail.addUser("johnwick", "John Wick", "waiter");

    await waiterAvail.addShift("johnwick", ["Monday", "Tuesday"]);

    let shiftsList = await waiterAvail.getShifts();

    let shift1 = shiftsList[0];
    let shift2 = shiftsList[1];

    assert.equal(shift1.day_name, "Monday");
    assert.deepEqual(shift1.shifts, ["John Wick"]);

    assert.equal(shift2.day_name, "Tuesday");
    assert.deepEqual(shift2.shifts, ["John Wick"]);
  });
});

describe("addUser", function() {
  beforeEach(async function() {
    await pool.query("delete from shifts");
    await pool.query("delete from users");
  });

  it("should add a user", async function() {
    let waiterAvail = WaiterAvailability(pool);

    await waiterAvail.addUser("klaus", "Nicklaus Mikaelson", "waiter");

    const user = await pool.query(
      "select user_name, full_name, user_type from users WHERE user_name = $1",
      ["klaus"]
    );

    assert.deepEqual(user.rows[0], {
      user_name: "klaus",
      full_name: "Nicklaus Mikaelson",
      user_type: "waiter"
    });
  });
});

/*describe("addShift", function() {
  beforeEach(async function() {
    await pool.query("delete from shifts");
    await pool.query("delete from weekdays");
    await pool.query("delete from waiter");
  });

  it("should add shifts", async function() {
    let waiterAvail = WaiterAvailability(pool);

    await waiterAvail.addShift("johndoe", ["Saturday", "Tuesday"]);

    let results1 = await pool.query(
      "SELECT user_name, day_name FROM users JOIN shifts ON users.id = shifts.waiter_id JOIN weekdays ON shifts.weekday_id = weekdays.id WHERE user_name = $1 AND day_name = $2",
      ["johndoe", "Saturday"]
    );

    let results2 = await pool.query(
      "SELECT user_name, day_name FROM users JOIN shifts ON users.id = shifts.waiter_id JOIN weekdays ON shifts.weekday_id = weekdays.id WHERE user_name = $1 AND day_name = $2",
      ["johndoe", "Saturday"]
    );

    assert.notEqual(results1.rowCount, 0);
    assert.notEqual(results1.rowCount, 0);
  });
});*/

describe("getUserShifts", function() {
  beforeEach(async function() {
    await pool.query("delete from shifts");
    await pool.query("delete from users");
  });

  it("should return user shifts", async function() {
    let waiterAvail = WaiterAvailability(pool);

    await waiterAvail.addUser("johnwick", "John Wick", "waiter");
    await waiterAvail.addUser("johndoe", "John Doe", "waiter");

    await waiterAvail.addShift("johnwick", ["Monday", "Tuesday"]);
    await waiterAvail.addShift("johndoe", ["Thursday", "Friday"]);

    let shiftsList = await waiterAvail.getUserShifts("johndoe");

    let shift1 = shiftsList[0];
    let shift2 = shiftsList[1];

    assert.equal(await shiftsList.length, 2);
    assert.equal(shift1.day_name, "Thursday");
    assert.equal(shift2.day_name, "Friday");
  });
});

describe("deleteShifts", function() {
  beforeEach(async function() {
    await pool.query("delete from shifts");
    await pool.query("delete from users");
  });

  it("should return 0 rowCount", async function() {
    let waiterAvail = WaiterAvailability(pool);

    await waiterAvail.addUser("johnwick", "John Wick", "waiter");
    await waiterAvail.addUser("johndoe", "John Doe", "waiter");

    await waiterAvail.addShift("johnwick", ["Monday", "Tuesday"]);
    await waiterAvail.addShift("johndoe", ["Thursday", "Friday"]);

    await waiterAvail.deleteShifts();

    let shiftsList = await pool.query("select * from shifts");

    assert.equal(shiftsList.rowCount, 0);
  });
});

describe("getUserType", function() {
  beforeEach(async function() {
    await pool.query("delete from shifts");
    await pool.query("delete from users");
  });

  it("should return 'waiter'", async function() {
    let waiterAvail = WaiterAvailability(pool);

    await waiterAvail.addUser("klaus", "Nicklaus Mikaelson", "waiter");

    assert.equal(await waiterAvail.getUserType("klaus"), "waiter");
  });

  it("should return 'admin'", async function() {
    let waiterAvail = WaiterAvailability(pool);

    await waiterAvail.addUser("elijah", "Elijah Mikaelson", "admin");

    assert.equal(await waiterAvail.getUserType("elijah"), "admin");
  });

  after(async function() {
    await pool.end();
  });
});

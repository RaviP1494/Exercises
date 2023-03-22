/** User class for message.ly */

const bcrypt = require("bcrypt");
const db = require("../db");
const ExpressError = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");

/** User of the site. */

class User {
  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    const hashed_pw = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO users
      (username, password, first_name, last_name, phone, join_at)
      VALUES
      ($1, $2, $3, $4, $5, current_timestamp)
      RETURNING username, password, first_name, last_name, phone;`,
      [username, hashed_pw, first_name, last_name, phone]
    );

    return result.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const result = await db.query(
      `
    SELECT password
    FROM users
    WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];
    if (user) {
      if ((await bcrypt.compare(password, user.password)) === true) {
        return true;
      }
    }
    return false;
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const result = await db.query(
      `
    UPDATE users
    SET 
    last_login_at = current_timestamp
    WHERE username = $1
    RETURNING username;`,
      [username]
    );
    if (!result.rows[0]) {
      throw new ExpressError(`No such user ${username}`, 404);
    }
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const results = await db.query(
      `SELECT 
      username, first_name, last_name, 
      phone, join_at, last_login_at
      FROM users;`
    );
    return results.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query(
      `
    SELECT username, first_name, last_name,
    phone, join_at, last_login_at
    FROM users
    WHERE username = $1`,
      [username]
    );
    if (!result.rows[0]) {
      throw new ExpressError(`No such user ${username}`, 404);
    }
    return result.rows[0];
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const userResult = await db.query(
      `SELECT username, first_name, last_name, phone
      FROM users
      WHERE username = $1;`,
      [username]
    );
    if (!userResult.rows[0]) {
      throw new ExpressError(`No such user ${username}`, 404);
    }
    const user = userResult.rows[0];
    const messageResults = await db.query(
      `SELECT DISTINCT
      m.id, m.body, m.sent_at, m.read_at,
      t.username, t.first_name, t.last_name, t.phone
      FROM users AS f
      JOIN messages AS m ON
      m.from_username = $1
      JOIN users AS t ON
      m.to_username = t.username;`,
      [username]
    );
    //console.log here because i can't understand why without DISTINCT, i get two identical rows
    // console.log(messageResults.rows);
    const messages = messageResults.rows.map((m) => ({
      id: m.id,
      body: m.body,
      sent_at: m.sent_at,
      read_at: m.read_at,
      to_user: {
        username: m.username,
        first_name: m.first_name,
        last_name: m.last_name,
        phone: m.phone,
      },
    }));
    // console.log(messages);
    return messages;
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const userResult = await db.query(
      `SELECT username, first_name, last_name, phone
      FROM users
      WHERE username = $1;`,
      [username]
    );
    if (!userResult.rows[0]) {
      throw new ExpressError(`No such user ${username}`, 404);
    }
    const user = userResult.rows[0];
    const messageResults = await db.query(
      `SELECT DISTINCT
      m.id, m.body, m.sent_at, m.read_at,
      f.username, f.first_name, f.last_name, f.phone
      FROM users AS t
      JOIN messages AS m ON
      m.to_username = $1
      JOIN users AS f ON
      m.from_username = f.username;`,
      [username]
    );
    const messages = messageResults.rows.map((m) => ({
      id: m.id,
      body: m.body,
      sent_at: m.sent_at,
      read_at: m.read_at,
      from_user: {
        username: m.username,
        first_name: m.first_name,
        last_name: m.last_name,
        phone: m.phone,
      },
    }));
    return messages;
  }
}

module.exports = User;

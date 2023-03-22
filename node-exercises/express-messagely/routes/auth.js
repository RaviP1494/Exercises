const express = require("express");
const ExpressError = require("../expressError");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { SECRET_KEY } = require("../config");

const router = new express.Router();

router.post("/login", async function (req, res, next) {
  try {
    if (!req.body.username || !req.body.password) {
      throw new ExpressError("Missing username of password to login", 400);
    }
  } catch (err) {
    return next(err);
  }
  const { username, password } = req.body;

  try {
    const resp = await User.authenticate(username, password);
    if (resp) {
      const token = jwt.sign({ username }, SECRET_KEY);
      await User.updateLoginTimestamp(username);
      return res.json({ token });
    } else {
      throw new ExpressError("Invalid username/password", 400);
    }
  } catch (err) {
    return next(err);
  }
});

router.post("/register", async function (req, res, next) {
  try {
    if (
      !req.body.username ||
      !req.body.password ||
      !req.body.first_name ||
      !req.body.last_name ||
      !req.body.phone
    ) {
      throw new ExpressError("Missing registration details", 400);
    }
  } catch (err) {
    next(err);
  }

  const { username, password, first_name, last_name, phone } = req.body;

  try {
    const user = await User.register({
      username,
      password,
      first_name,
      last_name,
      phone,
    });
    if (!user.username) {
      throw new ExpressError("Registration failed", 400);
    } else {
      const token = jwt.sign({ username: user.username }, SECRET_KEY);
      await User.updateLoginTimestamp(user.username);
      return res.json({ token });
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

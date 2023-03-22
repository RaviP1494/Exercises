const express = require("express");

const User = require("../models/user");

const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

const router = new express.Router();

router.get("/", ensureLoggedIn, async function (req, res, next) {
  let users;
  try {
    users = await User.all();
  } catch (err) {
    return next(err);
  }
  return res.json({ users });
});

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  const { username } = req.params;
  let user;
  try {
    user = await User.get(username);
  } catch (err) {
    return next(err);
  }
  return res.json({ user });
});

router.get("/:username/to", ensureCorrectUser, async function (req, res, next) {
  const username = req.params.username;
  let messages;
  try {
    messages = await User.messagesTo(username);
  } catch (err) {
    return next(err);
  }
  return res.json({ messages });
});

router.get(
  "/:username/from",
  ensureCorrectUser,
  async function (req, res, next) {
    const username = req.params.username;
    let messages;
    try {
      messages = await User.messagesFrom(username);
    } catch (err) {
      return next(err);
    }
    return res.json({ messages });
  }
);

module.exports = router;

const express = require("express");
const ExpressError = require("../expressError");

const Message = require("../models/message");
const { ensureLoggedIn } = require("../middleware/auth");

const router = new express.Router();

router.get("/:id", async function (req, res, next) {
  const user = req.user ? req.user : null;
  const id = req.params.id;
  let message;
  try {
    message = await Message.get(id);
  } catch (err) {
    return next(err);
  }
  if (
    !user.username === message.from_user.username ||
    !user.username === message.to_user.username
  ) {
    return next(new ExpressError("Unauthorized", 401));
  }
  return res.json({ message });
});

router.post("/", ensureLoggedIn, async function (req, res, next) {
  if (!req.body.to_username || !req.body.body) {
    return next(new ExpressError("Invalid message data", 400));
  }
  const { to_username, body } = req.body;
  let message;
  try {
    message = await Message.create(req.user, to_username, body);
  } catch (err) {
    return next(err);
  }
  return res.json({ message });
});

router.post("/:id/read", async function (req, res, next) {
  const id = req.params.id;
  let message;
  try {
    message = await Message.markRead(id);
  } catch (err) {
    return next(err);
  }
  if (!user.username === message.to_user.username) {
    return next(new ExpressError("Unauthorized", 401));
  }
  return res.json({ message });
});

module.exports = router;

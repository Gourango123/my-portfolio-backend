const express = require("express");

const { createMessage, getMessage, deleteMessage } = require("../controllers/message.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { messageLimiter } = require("../middleware/rateLimit.middleware");

const router = express.Router();

router.post("/", messageLimiter,  createMessage);
router.get("/", authMiddleware , getMessage);
router.delete("/:id", authMiddleware, deleteMessage);


module.exports = router;
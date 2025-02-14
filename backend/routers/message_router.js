import express from "express";

import {
  sendTileMessage,
  getConversations,
} from "../controllers/message_data.js";

const router = express.Router();

router.route("/send").post(sendTileMessage);
router.route("/get").get(getConversations);

export default router;

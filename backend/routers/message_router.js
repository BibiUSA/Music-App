import express from "express";

import { getConversations } from "../controllers/message_data.js";

const router = express.Router();

router.route("/get").get(getConversations);

export default router;

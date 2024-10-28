import express from "express";
import { getFeed } from "../controllers/homefeed.js";

const router = express.Router();

router.route("/").get(getFeed);

export default router;

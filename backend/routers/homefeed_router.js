import express from "express";
import { getFeed, getYourPosts } from "../controllers/homefeed.js";

const router = express.Router();

router.route("/").get(getFeed);
router.route("/yourposts").get(getYourPosts);

export default router;

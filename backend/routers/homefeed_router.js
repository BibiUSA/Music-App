import express from "express";
import { getFeed, getYourPosts, homeVideo } from "../controllers/homefeed.js";

const router = express.Router();

router.route("/").get(getFeed);
router.route("/homevideo").get(homeVideo);
router.route("/yourposts").get(getYourPosts);

export default router;

import express from "express";
import {
  getFeed,
  getYourPosts,
  homeVideo,
  getYourPostsOld,
} from "../controllers/homefeed.js";

const router = express.Router();

router.route("/").get(getFeed);
router.route("/homevideo").get(homeVideo);
router.route("/yourposts").get(getYourPosts);
router.route("/yourpostsold").get(getYourPostsOld);

export default router;

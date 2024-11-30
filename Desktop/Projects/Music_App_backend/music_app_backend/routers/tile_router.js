import express from "express";
import {
  createPost,
  likePost,
  unLikePost,
  reportPost,
} from "../controllers/add_tile.js";

const router = express.Router();

router.route("/newpost").post(createPost);
router.route("/likepost/:tile_id&:username").post(likePost);
router.route("/unlikepost/:tile_id&:username").delete(unLikePost);
router.route("/report").post(reportPost);

export default router;

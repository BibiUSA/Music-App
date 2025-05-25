import express from "express";
import {
  createPost,
  likePost,
  unLikePost,
  reportPost,
  updatePost,
  deletePost,
  newVideo,
} from "../controllers/add_tile.js";

const router = express.Router();

router.route("/newpost").post(createPost);
router.route("/likepost/:tile_id&:username").post(likePost);
router.route("/unlikepost/:tile_id&:username").delete(unLikePost);
router.route("/report").post(reportPost);
router.route("/edit").patch(updatePost);
router.route("/delete/:tile_id").delete(deletePost);
router.route("/newvideo").post(newVideo);

export default router;

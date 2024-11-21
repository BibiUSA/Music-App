import express from "express";
import { createPost, likePost, unLikePost } from "../controllers/add_tile.js";

const router = express.Router();

router.route("/newpost").post(createPost);
router.route("/likepost").post(likePost);
router.route("/unlikepost/:tile_id&:username").delete(unLikePost);

export default router;

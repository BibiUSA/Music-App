import express from "express";
import { createPost, likePost } from "../controllers/add_tile.js";

const router = express.Router();

router.route("/newpost").post(createPost);
router.route("/likepost").post(likePost);

export default router;

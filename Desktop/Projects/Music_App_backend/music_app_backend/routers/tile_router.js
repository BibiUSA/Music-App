import express from "express";
import { createPost } from "../controllers/add_tile.js";

const router = express.Router();

router.route("/newpost").post(createPost);

export default router;

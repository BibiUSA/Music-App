import express from "express";
import {
  saveUserInfo,
  lastLogInDate,
  isSignedIn,
} from "../controllers/userinfo.js";

const router = express.Router();

router.route("/save").post(saveUserInfo);
router.route("/logindate").patch(lastLogInDate);
router.route("/usercheck").get(isSignedIn);

export default router;

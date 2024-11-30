import express from "express";
import {
  saveUserInfo,
  lastLogInDate,
  isSignedIn,
  userInfo,
  usernameExists,
  updateUsername,
  updateImg,
} from "../controllers/userinfo.js";

const router = express.Router();

router.route("/save").post(saveUserInfo);
router.route("/logindate").patch(lastLogInDate);
router.route("/usercheck").get(isSignedIn);
router.route("/info").get(userInfo);
router.route("/check").get(usernameExists);
router.route("/username").patch(updateUsername);
router.route("/img").patch(updateImg);

export default router;

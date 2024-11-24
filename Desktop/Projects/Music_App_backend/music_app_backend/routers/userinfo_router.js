import express from "express";
import {
  saveUserInfo,
  lastLogInDate,
  isSignedIn,
  userInfo,
} from "../controllers/userinfo.js";

const router = express.Router();

router.route("/save").post(saveUserInfo);
router.route("/logindate").patch(lastLogInDate);
router.route("/usercheck").get(isSignedIn);
router.route("/info").get(userInfo);

export default router;

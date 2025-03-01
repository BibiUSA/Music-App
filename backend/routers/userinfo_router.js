import express from "express";
import {
  saveUserInfo,
  lastLogInDate,
  isSignedIn,
  userInfo,
  usernameExists,
  updateUsername,
  updateImg,
  userCheck,
  updateName,
  searchUser,
  friendInfo,
  updateFriend,
  getAllFriends,
  searchFriend,
  checkFriendship,
  getUID,
  getAllRequests,
} from "../controllers/userinfo.js";

const router = express.Router();

router.route("/save").post(saveUserInfo);
router.route("/logindate").patch(lastLogInDate);
router.route("/usercheck").get(isSignedIn);
router.route("/info").get(userInfo);
router.route("/check").get(usernameExists);
router.route("/username").patch(updateUsername);
router.route("/img").patch(updateImg);
router.route("/newuser").post(userCheck);
router.route("/updatename").patch(updateName);
router.route("/search").get(searchUser);
router.route("/friend").get(friendInfo);
router.route("/updatefriend").patch(updateFriend);
router.route("/allfriends").get(getAllFriends);
router.route("/searchfriend").get(searchFriend);
router.route("/checkfriendship").get(checkFriendship);
router.route("/allrequests").get(getAllRequests);
router.route("/uid").get(getUID);
export default router;

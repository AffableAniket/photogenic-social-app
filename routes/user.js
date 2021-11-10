const express = require("express");
const router = express.Router();
const {userPosts,updateFollowers,updateUnfollowers,updateProfilePic,searchUser,updateUserProfile} = require("../controller/user");
const requiredLogin = require("../middleware/requiredLogin");

router.route("/user/:userid").get(requiredLogin,userPosts)

router.route("/follow").put(requiredLogin,updateFollowers)

router.route("/unfollow").put(requiredLogin,updateUnfollowers)

router.route("/updatepic").put(requiredLogin,updateProfilePic)

router.route("/update-profile").put(requiredLogin,updateUserProfile)

router.route("/search-user").post(searchUser)

module.exports = router;

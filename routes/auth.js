const express = require("express");
const router = express.Router();
const {signup,signin,resetPassword,newPassword} = require("../controller/auth");
const requiredLogin = require("../middleware/requiredLogin");
router.route("/signup").post(signup)
router.route("/signin").post(signin)
router.route("/reset").post(resetPassword)
router.route("/reset/:token").post(newPassword)
module.exports = router;

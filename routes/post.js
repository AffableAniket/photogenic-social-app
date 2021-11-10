const express = require("express");
const router = express.Router();
const {createPost,getAllPost,getMyPost,getLikes,getUnlikes,getComments,getUserPost,deletePosts,deleteComments,updateUserPost} = require("../controller/post");

const requiredLogin = require("../middleware/requiredLogin");

router.route("/post").post(requiredLogin,createPost);

router.route("/get").get(requiredLogin,getAllPost);

router.route("/mypost").get(requiredLogin,getMyPost);

router.route("/like").put(requiredLogin,getLikes);

router.route("/unlike").put(requiredLogin,getUnlikes);

router.route("/comment").put(requiredLogin,getComments);

router.route("/delete-comment").put(requiredLogin,deleteComments);

router.route("/following").get(requiredLogin,getUserPost);

router.route("/update-post").put(requiredLogin,updateUserPost);

router.route("/delete/:postId").delete(requiredLogin,deletePosts);


module.exports = router;

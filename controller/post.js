const mongoose = require("mongoose");
require("../models/post");
const Post = mongoose.model("Post");
const bcrypt = require("bcryptjs");
const {SECRET_KEY} = require("../config/key.js");
const jwt = require("jsonwebtoken");

exports.createPost = (req,res,next) => {
  const {title,body,pic} = req.body;
  if(!title || !body || !pic){
    return res.status(401).json({msg: "User must be logged in"});
  }

  const post = new Post({
    title,
    body,
    photo : pic,
    postedBy: req.user
  })
  req.user.password = undefined;
  post.save().then((result) => {
    res.json({post: result,msg:"User data posted :)"});
  }).catch((err) => {
    res.json({err: "Something went wrong !"});
  })
}
exports.getMyPost = (req,res,next) => {
    Post.find({postedBy : req.user._id}).populate("postedBy","_id name").sort("-createdAt").then((mypost) => {
      res.json({post: mypost});
    }).catch((err) => {
      console.log(err);
    });
}

exports.getAllPost = (req,res,next) => {
    Post.find().populate("postedBy","_id name").populate("comments.postedBy","_id name").sort("-createdAt").then((post) => {
      res.json({post: post});
    }).catch((err) => {
      console.log(err);
    });
}

exports.getLikes = (req,res,next) => {
    Post.findByIdAndUpdate(req.body.postId,{
      $push: {likes: req.user._id}
     },{
      new: true,
      upsert: true
    }).populate("postedBy","_id name").populate("comments.postedBy","_id name").exec((err,result) => {
         if(err){
          return res.status(422).json({msg : "error like"})
         }
        else{
           res.json(result)
          }
     })
}

exports.getUnlikes = (req,res,next) => {
    Post.findByIdAndUpdate(req.body.postId,{
      $pull: {likes: req.user._id}
     },{
      new: true,
      upsert: true
    }).populate("postedBy","_id name").populate("comments.postedBy","_id name").exec((err,result) => {
         if(err){
          return res.status(422).json({msg : "error unlike"})
         }
        else{
           res.json(result)
          }
     })
}


exports.getComments = (req,res,next) => {
    const comment = {text: req.body.text,postedBy:req.user._id }
    Post.findByIdAndUpdate(req.body.postId,{
      $push: {comments: comment}
     },{
      new: true,
      upsert: true
    }).populate("comments.postedBy","_id name").populate("postedBy","_id name").exec((err,result) => {
         if(err){
          return res.status(422).json({msg : "error unlike"})
         }
        else{
           res.json(result)
          }
     })
}



exports.deleteComments = (req,res,next) => {

    Post.findByIdAndUpdate(req.body.postId,{
      $pull: {comments:{_id:req.body.commentId}}
     },{
      new: true,
      upsert: true
    }).populate("comments.postedBy","_id name").populate("postedBy","_id name").exec((err,result) => {
         if(err){
          return res.status(422).json({msg : "error unlike"})
         }
        else{
           res.json(result)
          }
     })
}


exports.deletePosts = (req,res,next) => {
    Post.findOne({_id: req.params.postId}).populate("postedBy","_id name").exec((err,result) => {
         if(err || !result){
          return res.status(422).json({msg : "error delete"})
         }
        if(result.postedBy._id.toString() === req.user._id.toString()){
            result.remove();
           res.json(result)
          }
     })
}


exports.getUserPost = (req,res,next) => {
    Post.find({postedBy: {$in: req.user.following}}).populate("postedBy","_id name").populate("comments.postedBy","_id name").sort("-createdAt").then((post) => {
      res.json({post: post});
    }).catch((err) => {
      console.log(err);
    });
}

exports.updateUserPost = (req,res,next) => {
   var updateObj = req.body.updatePost;
   const myId = req.body.id;


   Object.filter = (obj,predicate) =>
       Object.keys(obj)
         .filter((key) => predicate(obj[key]))
         .reduce((res,key) => (res[key]=obj[key],res),{});

   var filterUpdate = Object.filter(updateObj,value => value !== "");
console.log("Filter");
console.log(myId);

   Post.findByIdAndUpdate(myId,{
         $set : filterUpdate
},{
 new: true
},
(err,result) => {
    if(err){
     return res.status(422).json({msg: "error pic"});
    }
    else{
     return res.json(result);
    }
})
}

const mongoose = require("mongoose");
require("../models/user");
require("../models/post");
const User = mongoose.model("User");
const Post = mongoose.model("Post");


exports.userPosts = (req,res,next) => {
     User.findOne({_id : req.params.userid}).select("-password").then((user) => {
      Post.find({postedBy : req.params.userid }).populate("postedBy","_id name")
        .exec((err,posts) => {
            if(err){
              return res.status(422).json({msg: err});
                }
            else{
                res.json({user,posts});
                }
          })
   }).catch((err) => { return res.status(404).json({error : "user not found"})})

 }

exports.updateFollowers = (req,res,next) => {
     User.findByIdAndUpdate(req.body.followId,{
         $push: {followers:req.user._id}
     },{
        new:true
        },(err,result) => {
             if(err){
              return res.status(422).json({msg: "error followers"})
              }

                 User.findByIdAndUpdate(req.user._id,{
                    $push: {following:req.body.followId}
                    },{
                       new:true
                       }).select("-password").then((response) => res.json(response)).catch((err) => {
                        return res.status(422).json({msg: "error following"})
                        } )

          })
 }

 exports.updateUnfollowers = (req,res,next) => {
      User.findByIdAndUpdate(req.body.unfollowId,{
          $pull: {followers:req.user._id}
      },{
         new:true,
         upsert:true
         }).exec((err,result) => {
              if(err){
               return res.status(422).json({msg: "error followers"})
               }
              else{
                  User.findByIdAndUpdate(req.user._id,{
                     $pull:{following: req.body.unfollowId}
                     },{
                        new:true,
                        upsert:true
                        }).select("-password").then((response) => res.json(response)).catch((err) => {
                         return res.status(422).json({msg: "error following"})
                         } )
               }
           })
  }

exports.updateProfilePic = (req,res,next) => {
       User.findByIdAndUpdate(req.user._id,{
           $set: {pic: req.body.pic}
        },{
          new:true
         },(err,result) => {
             if(err){
              return res.status(422).json({msg: "error pic"});
             }
             else{
              return res.json(result);
               }

         })
}

exports.updateUserProfile = (req,res,next) => {
      var updateObj = req.body;

      const filterObj = () =>
      {
         Object.filter = (obj,predicate) =>
          Object.keys(obj)
         .filter((key) => predicate(obj[key]))
         .reduce((res,key) => (res[key]=obj[key],res),{});

         var filterUpdate = Object.filter(updateObj,value => value !== "");
       console.log("Filter");
       console.log(filterUpdate);

        User.findByIdAndUpdate(req.user._id,{
            $set: filterUpdate
         },{
           new:true
          },(err,result) => {
              if(err){
               return res.status(422).json({msg: "error user update"});
              }
              else{
               return res.json(result);
                }

          }) }

     if(updateObj.email !== ""){
             User.findOne({email:updateObj.email}).then((savedUser) => {
               if(savedUser){
                 return res.status(422).json({success: false,error: `User Exists`});
               }
            else{
                filterObj();
           }
      })

    }
   else{
         filterObj();
        }
}

exports.searchUser = (req,res,next) => {
       const userPattern = new RegExp("^"+req.body.query)
       User.find({email: {$regex: userPattern }}).select("_id email").then((user) => {
         return res.json({user});
        }).catch((err) => {console.log(err);})

}

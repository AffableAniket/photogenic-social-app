const {SECRET_KEY} = require("../config/key");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("../models/user");
const User = mongoose.model("User");

module.exports = (req,res,next) => {
   const {authorization} = req.headers;
   if(!authorization){
     return res.status(401).json({msg : "You must be logged in" });
   }
   const token = authorization.replace("Bearer ","");
   jwt.verify(token,SECRET_KEY,(err,payload) => {
     if(err){
       return res.status(422).json({msg : "verification error"})
     }
     const {_id} = payload;
    User.findById(_id).then((userdata) =>{
       req.user = userdata;
       next()
    })

})
}

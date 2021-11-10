const mongoose = require("mongoose");
require("../models/user");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const {SECRET_KEY,API_KEY,EMAIL_PORT} = require("../config/key");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(API_KEY);

exports.signup = (req,res,next) => {
  const {name,email,password,pic} = req.body;
  if(!name || !email || !password){
    return res.status(422).json({success: false,error: `Empty Fields`});
  }
  User.findOne({email: email}).then((savedUser) => {
    if(savedUser){
      return res.status(422).json({success: false,error: `User Exists`});
    }
    bcrypt.hash(password,10).then((hashedPassword) => {
      const user = new User({
        name,
        email,
        password:hashedPassword,
        pic
      })
         user.save().then((user) => {
           if(user){
           return res.json({ msg : `saved the user successfully`});
           next();
        }
         }).catch((err) => {
           console.log(err);
         })
    }).catch((err) => {
     console.log(err);
    })
  }).catch((err) => {
     console.log(err);
  })


}

exports.signin = (req,res,next) => {
   const {email,password} = req.body;
   if(!email || !password){
     return res.status(422).json({error : "Empty Fields"});
   }
   User.findOne({email: email}).then((savedUser) => {
     if(!savedUser){
       return res.status(401).json({error : "Invalid Email or Password"});
     }
     bcrypt.compare(password,savedUser.password).then((doMatch) =>{
       if(doMatch){
           const token = jwt.sign({_id: savedUser._id},SECRET_KEY);
           const {_id,name,email,followers,following,pic} = savedUser;
           return res.json({token : token,msg: "logged in successfully",user: {_id,name,email,followers,following,pic}});
            next();
       }
       else{
         res.status(422).json({error : "Invalid Email or Password"});
       }
     }).catch((err) =>{
       console.log(err);
     })
   }).catch((err) =>{
     console.log(err);
   });

}

exports.resetPassword = (req,res,next) => {
   crypto.randomBytes(32,(err,buffer) => {
    if(err){
     return res.status(422).json({msg: "Error buffer"})
    }
   const token = buffer.toString("hex");
   User.findOne({email:req.body.email})
   .then((user) => {
      if(!user){
        return res.status(422).json({msg: "User not found!!"})
      }
     user.resetToken=token;
     user.expiredToken=Date.now()+3600000;
     user.save().then((result) => {
       const message = {
        to : user.email,
        from : "akimjohnson5@gmail.com",
        subject : "Reset Password",
        html: `<h4>A request to reset your password has been made.If you did make this request just click the LINK below:</h4>
              <p>${EMAIL_PORT}/reset/${token}</p>`
       }
       sgMail.send(message).then((res) => {console.log("Email Sent");})
      .catch((err) => {console.log(err);});
      res.json({msg: "Check Your Inbox"});
    })
   })
  })
}

exports.newPassword = (req,res,next) => {
  const newPass = req.body.password;
  const newToken = req.body.token;
  User.findOne({resetToken: newToken,expiredToken: {$gt:Date.now()}}).then((user) => {
  if(!user){
   res.status(422).json({err: "User doesnt exist"})
  }
    bcrypt.hash(newPass,10).then((hashedPassword) => {
         user.password=hashedPassword;
         user.resetToken=undefined;
         user.expiredToken=undefined;
         user.save().then((savedUser)  => {
             res.json({msg: "Password Updated Successfully"});
          })

    })
})

}

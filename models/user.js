const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true
  },
  email : {
    type: String,
    required: true
  },
  password : {
    type: String,
    required: true
  },
  followers: [{
    type:ObjectId,
    ref:"User"
    }],
  pic: {
   type: String,
   default: "https://cdn-icons-png.flaticon.com/512/456/456212.png"
   },
  resetToken: String,
  expiredToken: Date,
  following: [{
    type:ObjectId,
    ref:"User"
     }]
});

mongoose.model("User",userSchema);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080;
const {MONGO_URI} = require("./config/key");

mongoose.connect(MONGO_URI,{
  useNewUrlParser : true,
  useUnifiedTopology : true
})

mongoose.connection.on("connected",() =>{
  console.log("Mongo Connected");
})

mongoose.connection.on("error",(err) => {
  console.log("Mongo Error",err);
})


app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

require("./models/user");
require("./models/post");

if(process.env.NODE_ENV=="production"){
app.use(express.static("client/build"));
const path = require("path");
app.get("*",(req,res) =>{
  res.sendFile(path.resolve(__dirname,"client","build","index.html"))
})
}

app.listen(PORT,() =>{
  console.log(`Server running on PORT ${PORT}`);
})

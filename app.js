//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose");
const ejs= require("ejs");
const app = express();
const encrypt= require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true})

const userSchmema= new mongoose.Schema({
  email:String,
  password:String
});
// console.log(process.env.SECRET);

userSchmema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
const User= mongoose.model("User",userSchmema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/",function(req,res){
  res.render("home");
})
app.get("/login",function(req,res){
  res.render("login");
})
app.get("/register",function(req,res){
  res.render("register");
})

app.post("/register",function(req,res){
  const newUser= new User({
    email:req.body.username,
    password:req.body.password
  })
  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets")
    }
  });
});

app.post("/login",function(req,res){
  var username = req.body.username
  var password = req.body.password
  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err)
    }
    else{
      if(foundUser){
        if(foundUser.password===password){
          res.render("secrets");
        };
      };
    };
  });
});








app.listen(3000,function(){
  console.log("server is live on 3000")
});

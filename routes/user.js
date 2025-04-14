const express = require('express');
const User=require("../models/user")
const router = express.Router();
const WrapAsync = require('../utils/WrapAsync');
const passport = require("passport");

const {redirectedUrl,validateUser} =require("../middleware")
const { getsignup,postsignup,getlogin,postlogin,getlogout }=require("../controllers/user")
router.get("/signup",getsignup)

router.post("/signup",validateUser,WrapAsync(postsignup))

router.get("/login",getlogin)
//this route middleware is used to check if password and all are right (passport.authenticate)
router.post("/login",redirectedUrl,passport.authenticate('local', 
    {
    failureRedirect: '/login', 
    failureFlash: true //for flash message
    }),
   postlogin)
router.get('/logout', getlogout);

module.exports=router;
    if (process.env.NODE_ENV !== "production") {
        require("dotenv").config();
    }

    const express=require("express")
    const app=express();
    const path =require("path")
    const methodOverride = require('method-override')
    const mongoose = require('mongoose');
    let dbUrl=process.env.ATLAS_DB_URL;



    //routes
    const listings=require("./routes/listing");
    const reviews=require("./routes/review")
    const user=require("./routes/user");

    //for layout will be using ejs-mate
    const ejsMate = require('ejs-mate');

    const ExpressError=require("./utils/ExpressError")
    //express session
    const session = require('express-session')
    const MongoStore = require('connect-mongo');
    //flash for flash messages
    const flash = require('connect-flash');

    //passport and passport-local
    const passport = require("passport");
    const LocalStrategy = require("passport-local");
    const User=require("./models/user")

    //ALL THE MIDDLEWARES

    //mongo store and session(its only for local not online (express session))
    const store=MongoStore.create({
        mongoUrl: dbUrl,
        crypto:{
            secret:process.env.SECRET,
        },
        ttl:14*24*3600,
    })

    app.use(session({
        store,
        secret:process.env.SECRET,
        resave:false,
        saveUninitialized:true,
        cookie:{
            expires:Date.now()+7*24*60*60*1000,
            maxAge:7*24*60*60*1000,//maximum age of 1 week
            httpOnly:true
        }
    }   
    ))
    //flash
    app.use(flash());//include it above the routes all the time

    //passport 
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()))
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    //mongodb connect

    mongoose.connect(dbUrl)
    .then(() => console.log('Connected!'));

    //other middlewares for ejs and ehs-mate etc...
    app.use(methodOverride('_method'))
    app.set("view engine","ejs")      
    app.set("views",path.join(__dirname,"views"))
    app.use(express.static(path.join(__dirname,"public")))  
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    app.engine("ejs",ejsMate);



    //keep the middlewares for flash as well as user
    app.use((req,res,next)=>{
        res.locals.successmsg=req.flash("success");
        res.locals.errormsg=req.flash("error");
        res.locals.curruser=req.user;
        next();
    })


    app.use("/listings",listings);//for listing route
    app.use("/listings/:id/reviews",reviews);//for listing route along with reviews
    app.use("/",user);
    app.get("/",(req,res)=>{
        res.redirect("/listings");
    })
    //for every other route which is not present wit any type of requests
    //NOTE:next is used to call the error middleware
    app.all("*",(req,res,next)=>{   
        next(new ExpressError(404,"Page not found"));//it throwns an error message gor all get/post/patch/update/delete(all)
    })

    //error middleware (the middleware which has 4 parameters)
    app.use((err,req,res,next)=>{
        let { statuscode=500,message="some error has occured" }=err;//= are the default status code/message
        res.status(statuscode).render("listings/error.ejs",{ message });
    })
    const port= process.env.PORT || 3000;
    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });



const User=require("../models/user")

let getsignup=(req,res)=>{
    res.render("./user/form.ejs")
}

let postsignup=async(req,res)=>{
    try{//because we will need the e.message caught from the try "e"
        let { username,password,email }=req.body;
        let newUser=await new User({
        username:username,
        email:email,
        });
    
        await User.register(newUser,password);
        //automatically gets logged in in using req.login and u have to pass parameter as something thats has been .register
        //when us signup at first its also considered as login right
        req.login(newUser,(e)=>{
        if(e){
            next(e);
        }
        else{
            req.flash("success","Welcome to Wanderlust")
            res.redirect("/listings");
            }
    });
}catch(err){
    req.flash("error",err.message);
    res.redirect("/signup");
}
}
let getlogin=(req,res)=>{
    res.render("./user/login.ejs");
}
let postlogin= async(req,res)=>{
    req.flash("success","Welcome to wanderlust");
    let url;
    if(res.locals.url){
        url=res.locals.url;
    }else{
        url="/listings"
    }
    res.redirect(url);
}
let getlogout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }else{
        req.flash("success","you have successfully logged out")
        res.redirect('/login');
        }
    });
}
module.exports={ getsignup,postsignup,getlogin,postlogin,getlogout };
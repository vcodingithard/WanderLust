const Review=require("./models/review")
const Listing=require("./models/listing")
const {listingSchema}=require("./Schema")
const {reviewSchema}=require("./Schema")
const {userSchema}=require("./Schema")

let isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.url = req.originalUrl;
        req.flash("error","you have to login in order to add your property")
        res.redirect("/login");//this is used to end the execeuteion
    }else{
        next();
    }
}
let redirectedUrl=(req,res,next)=>{
    if(req.session.url){
        res.locals.url=req.session.url;//use res.locals for storing information within the 
        // routes and view engines basically for temporaray purpose and  use storing larger data
    }
    next();
}

let checkOwner=async(req,res,next)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    if(data.owner._id.toString() != res.locals.curruser._id.toString()){
        req.flash("error","you have no authorization")
        res.redirect(`/listings`)
    }else{
        next();
    }
} 

let checkAuthor = async (req, res, next) => {
    let { reviewid } = req.params; // Corrected parameter name
    let data = await Review.findById(reviewid).populate("author"); 
    if (!data) {
        req.flash("error", "Review not found!");
        return res.redirect("/listings");
    }
    if (data.author._id.toString() === res.locals.curruser._id.toString()) { 
        next();
    } else {
        req.flash("error", "You have no authorization for this");
        res.redirect("/listings");
    }
};




//function for validation of schema(chatgpt it if u have any doubt)
const validateListing=(req,res,next)=>{
    let { error }=listingSchema.validate(req.body);
    if(error){
        console.log(error);
        let errMsg=error.details.map((el)=>el.message).join(" ");
        console.log(errMsg)
        throw new ExpressError(400,errMsg);// u will be sending an error is present na
    }else{
        next();//goes to the next middelware or the route
    }
}
const validateUser=(req,res,next)=>{
    let { error }=userSchema.validate(req.body)
    if(error){
        let message=error.details.map((m)=>m.message).join(" ");
        throw new ExpressError(400,message)
    }else{
        next();
    }
}
const validateReview=(req,res,next)=>{
    let { error }=reviewSchema.validate(req.body);
    if(error){
        console.log(error);
        let errmsg=error.details.map((m)=>m.message).join(" ");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}
const postOwner = async (req, res, next) => {
    let { id } = req.params;
    let list = await Listing.findById(id).populate("owner");

    if (list.owner._id.equals(req.user._id)) {
        req.flash("error", "You cannot review your own post");
        return res.redirect(`/listings/${id}/show`);
    } else {
        next();
    }
}


module.exports={isLoggedIn,redirectedUrl,checkOwner,validateListing,validateUser,validateReview,checkAuthor,postOwner};

/*1.to check if a user has loggen in or not using req.isAutheticated
  2. ro check if a req.session.url is saved or not  */
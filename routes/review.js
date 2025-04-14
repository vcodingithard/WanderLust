const express=require("express");
const router=express.Router({ mergeParams:true })
const WrapAsync=require("../utils/WrapAsync")
const {isLoggedIn,redirectedUrl,checkAuthor,validateReview,postOwner}=require("../middleware")
const {postReview,deleteReview}=require("../controllers/review")

//review post
router.post("/",isLoggedIn,postOwner,redirectedUrl,validateReview,WrapAsync(postReview));

//delete review
router.delete("/:reviewid",isLoggedIn,redirectedUrl,checkAuthor,WrapAsync(deleteReview))

module.exports=router;
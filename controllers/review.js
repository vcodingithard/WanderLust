const Listing = require("../models/listing");
const Review=require("../models/review");

let postReview=async (req, res) => {
    let { id } = req.params;
    let post = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // Corrected author assignment
    post.reviews.push(newReview);
    await newReview.save();
    await post.save(); // Save post after updating reviews array
    req.flash("success", "A new review was added");
    res.redirect(`/listings/${id}/show`);
}
let deleteReview=async(req,res)=>{
    let { id, reviewid }=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{ reviews:reviewid }});//it will delete everything that matches with the given data
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","A review was deleted")
    res.redirect(`/listings/${ id }/show`)  
}
module.exports={postReview,deleteReview};
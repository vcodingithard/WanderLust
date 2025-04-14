const Listing=require("../models/listing")


//home route which shows all the lists
let index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{ allListings })
}

//is logged in checks if a user is looged in or not using isauthenicated()
//shows individual list
let show=async(req,res)=>{
    let { id }=req.params;
    let list = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
             path: "author"
             }
    })
    .populate("owner");//it is used to access the reviews array only
    if(!list){
        req.flash("error","You're currently looking for a list that dosen't exist");
        return res.redirect("/listings")
    } 
    res.render("listings/show.ejs",{ list });
}
let newPage = async(req,res)=>{
    res.render("listings/new.ejs");
}
let deleteList=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","the list was deleted");
    return res.redirect("/listings");
}
let searchInput=async (req, res) => {
    let { name } = req.query;

    // Replace `+` with space and ensure single spacing
    name = name.replace(/\+/g, " ").replace(/\s+/g, " ").trim();

    let allListings = await Listing.find({ 
        title: { $regex: name, $options: "i" } } // Case-insensitive search
    );
    if (!allListings || allListings.length === 0) {
        req.flash("error", "No listings were found");
        return res.redirect("/listings");
    }
    req.flash("success","your lists were found");
    res.render("./listings/index.ejs", { allListings });
}
let newList=async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let data= new Listing(req.body.listing);

    data.owner=req.user._id;
    data.image.filename=filename;
    data.image.url=url;
    await data.save();

    req.flash("success","A new list was created")
    res.redirect("/listings")
}
let updateList=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(
        id, req.body.listing , { runValidators: true});
    req.flash("success","the list was successfully updated")
    res.redirect(`/listings/${id}/show`);
}
let editPage=async(req,res)=>{
    let {id}=req.params;
    let list= await Listing.findById(id);
    let img= list.image.url;
    let image=img.replace("/upload","/upload/o_30");
    res.render("listings/edit.ejs",{ list,image })
}
module.exports={index,show,newPage,deleteList,searchInput,newList,updateList,editPage}
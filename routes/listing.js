const express=require("express");
const router=express.Router();
const WrapAsync=require("../utils/WrapAsync")
const {isLoggedIn,checkOwner,validateListing, redirectedUrl}=require("../middleware")
const {index,show,newPage,deleteList,searchInput,newList,updateList,editPage}=require("../controllers/listing.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")

const upload = multer({ storage })

router.get("/",WrapAsync(index));

router.get("/:id/show",WrapAsync(show))

router.delete("/:id",isLoggedIn,checkOwner,WrapAsync(deleteList))

router.get("/new",isLoggedIn,newPage); 

router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing,WrapAsync(newList));

router.get("/:id/edit",isLoggedIn,checkOwner,WrapAsync(editPage));

router.patch("/:id",isLoggedIn,checkOwner,validateListing,WrapAsync(updateList) );


router.get("/search", WrapAsync(searchInput));


module.exports=router; 
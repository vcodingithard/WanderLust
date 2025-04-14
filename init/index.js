const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/WanderLust')
  .then(() => console.log('Connected!'));
//data
const userData=require("./data");
const Listing=require("../models/listing");
const user = require('../models/user');
  
async function listing(){
  await Listing.deleteMany({}).then((res)=>{
  console.log("documents were deleted",res)
  });
  let updatedData=userData.data.map((obj)=>({...obj,owner:"67e3dc8d3a3184d5b01df42f"}));
  await Listing.insertMany(updatedData).then((res)=>{
    console.log("documents were inserted",res);
  }).catch((err)=>{
  console.log("couldnt insert the data",err)
  });
}
listing();

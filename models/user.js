const mongoose=require("mongoose");
const {Schema}=mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    }
})

userSchema.plugin(passportLocalMongoose);//for username and passport

module.exports=mongoose.model("User",userSchema);
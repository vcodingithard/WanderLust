const mongoose = require('mongoose');
const Review = require("./review");
const User= require("./user");
const { required } = require('joi');
const { Schema } = mongoose;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        url:{
            type:String
        },
        filename:{
            type:String
        },
    },
    filters:{
        type:[String],
        required:true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String
    },
    country: {
        type: String,
        required: true
    },
    reviews: [ //here we will be passing a reference of review using the schema.type.objectid and ref
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

// ✅ Move the middleware BEFORE model creation
listingSchema.post("findOneAndDelete", async (listing) => {//here post because we will be making changes after 
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

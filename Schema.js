const Joi = require("joi");

const listingSchema = Joi.object({
        listing: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().min(0).required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        image:Joi.string().allow("",null),
        country:Joi.string().required()
    }).required()//here listing is required
});


const reviewSchema=Joi.object({
    review:Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().min(1).max(5).required(),
    }).required()//here review is required
})

const userSchema=Joi.object({
    username:Joi.string().required(),
    email:Joi.string().required(),
    password:Joi.string().required(),
})

module.exports = { listingSchema,reviewSchema,userSchema };//we are using { } because we are exporting multiple contents and we have to access 
// that right in other pages so that u can access
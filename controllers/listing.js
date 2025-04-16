// Import necessary modules and setup environment variables
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const Listing = require("../models/listing");
const axios = require('axios');

// Define predefined filters
const predefinedFilters = ["Beaches", "Treks", "Culture", "Temples", "Hills", "Street Food", "Seafood", "Wild Life", "Backwaters"];

// Home route to show all listings
let index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// Show individual listing
let show = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!list) {
        req.flash("error", "You're currently looking for a list that doesn't exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { list });
};

// Page to create a new listing
let newPage = async (req, res) => {
    res.render("listings/new.ejs");
};

// Delete a listing
let deleteList = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "The list was deleted");
    return res.redirect("/listings");
};

// Search listings based on name
let searchInput = async (req, res) => {
    let { name } = req.query;
    name = name.replace(/\+/g, " ").replace(/\s+/g, " ").trim();

    let allListings = await Listing.find({
        title: { $regex: name, $options: "i" } // Case-insensitive search
    });

    if (!allListings || allListings.length === 0) {
        req.flash("error", "No listings were found");
        return res.redirect("/listings");
    }

    req.flash("success", "Your lists were found");
    res.render("./listings/index.ejs", { allListings });
};

// Create a new listing with AI-generated filters
let newList = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let data = new Listing(req.body.listing);

    data.owner = req.user._id;
    data.image.filename = filename;
    data.image.url = url;

    try {
        // Construct the prompt for Gemini API
        const prompt = `Based on the location: "${req.body.listing.location}", suggest  relevant filters from the following list: ${predefinedFilters.join(", ")}. The response should be a simple comma-separated list of the filters.`;

        // Send the request to Gemini API using axios, simulating the curl request
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [{ text: prompt }]
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Handle the Gemini API response
        const responseText = response.data.candidates[0].content.parts[0].text;
        if (responseText) {
            // Split the response text into an array and remove any extra spaces
            const generatedFilters = responseText.split(",").map(filter => filter.trim());
            data.filters = [...new Set([...(data.filters || []), ...generatedFilters])]; // Ensure no duplicates
        }

        // Save the new listing
        await data.save();
        req.flash("success", "A new list was created");
        res.redirect("/listings");

    } catch (error) {
        console.error("Error calling Gemini API:", error);

        // Handle error gracefully and still save the listing even if filter generation fails
        req.flash("error", "Failed to generate filters for the listing.");
        await data.save();
        res.redirect("/listings");
    }
};

// Update an existing listing
let updateList = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true });
    req.flash("success", "The list was successfully updated");
    res.redirect(`/listings/${id}/show`);
};

// Edit a listing
let editPage = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    let img = list.image.url;
    let image = img.replace("/upload", "/upload/o_30");
    res.render("listings/edit.ejs", { list, image });
};

// Filter listings based on selected filters
const filterList = async (req, res) => {
    let { filter } = req.query;
    console.log(filter);

    if (!filter) {
        req.flash("error", "No filters were given");
        return res.redirect("/listings");
    }

    // Normalize to an array
    let filters = Array.isArray(filter) ? filter : [filter];

    // Find listings where the 'filters' array contains ANY of the selected filters
    let allListings = await Listing.find({ filters: { $in: filters } });

    if (!allListings.length) {
        req.flash("error", "No listings matched the selected filters");
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListings });
};


module.exports = {
    index, show, newPage, deleteList, searchInput, newList, updateList, editPage, filterList
};

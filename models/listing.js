const mongoose = require('mongoose')
const {Schema} = mongoose
const Review = require("./review.js")

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        filename: {
            type: String,
            default: "default_filename"
        },
        url: {
            type: String,
            default: "https://images.pexels.com/photos/221387/pexels-photo-221387.jpeg",
            set: (v) => v === "" ? "https://images.pexels.com/photos/221387/pexels-photo-221387.jpeg" : v
        }    
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
})

//when delete req on /listings/:id , Listing.findByIdAndDelete func called, which triggre this middleware
//mongoose middleware, when findByIdAndDelete func called in Listing collection, findOneAndDelete middleware called
listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema); 
module.exports = Listing;
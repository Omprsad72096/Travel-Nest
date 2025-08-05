const mongoose = require("mongoose")
const {Schema} = mongoose

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        // set: (v) => v === "" ? Date.now : v
    }
})

const Review = mongoose.model("Review", reviewSchema)
module.exports = Review
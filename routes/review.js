const express = require('express')
const router = express.Router({mergeParams: true})

const { reviewSchema } = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")
const wrapAsync = require("../utils/wrapAsync.js")
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")


//joi schema validaton for reviews
const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body)
    if(error){
        throw new ExpressError(400, error)
    } else {
        next()
    }
}

//add review onn listings
router.post("/", validateReview, wrapAsync(async (req, res) => {
    console.log(req.params)
    let listing = await Listing.findById(req.params.id)
    //req. body = { review: { rating: '2', comment: 'om om om0 om omo omm ' } }
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview)
    
    await newReview.save()
    await listing.save()
    res.redirect(`/listings/${req.params.id}`)
}))

//delete a review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;

    console.log("review delete page active")

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)

    res.redirect(`/listings/${id}`)
}))


module.exports = router;
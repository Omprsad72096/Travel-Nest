const express = require("express")
const router = express.Router()

const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js")
const Listing = require("../models/listing.js")

//joi schema validation for listings middleware
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body)
    if(error){
        // let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, error)
    } else {
        next()
    }
}


//index route- show all listings
router.get("/", wrapAsync(async (req, res) => {
    const allListngs = await Listing.find({})

    res.render("listings/index", { allListngs })
}))

//create route - create new listing 
router.get("/new", (req, res) => {
    res.render("listings/new")
})

router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    //if post req sent from postman without listing obj, you cant create this error from browser cuz form fields are set to required
    //req.body = {listing: {title: 'skdjfn',description: 'knwadjdfni',image: { filename: 'oisnhrfoin', url: 'oisfdffoi' },price: '588',location: 'ksjsfn',country: 'keni'}}
    let newListing = new Listing(req.body.listing)
    await newListing.save()
    res.redirect("/listings")
}))

//show route - show songle document with help of id
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params

    let listing = await Listing.findById(id).populate("reviews")
    res.render("listings/show", { listing })
}))

//edit and update route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params

    let listing = await Listing.findById(id)
    res.render("listings/edit", { listing })
}))

router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    //req.body = {listing: {title: 'om edit',description: 'desp1 edit',image: { filename: 'img edit', url: 'imgLink edit' },price: '10011001',location: 'dhanbad edit',country: 'india edit'}}
    let {id} = req.params
    //Listing.findByIdAndUpdate(id, {title: 'om edit',description: 'desp1 edit',image: { filename: 'img edit', url: 'imgLink edit' },price: '10011001',location: 'dhanbad edit',country: 'india edit'});

    await Listing.findByIdAndUpdate(id, {...req.body.listing});

    res.redirect(`/listings/${id}`)
}))

//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params

    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
}))


module.exports = router;
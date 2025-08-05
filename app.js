const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

//connect with mongoose
const MONGO_URL = "mongodb://127.0.0.1:27017/TravelNest"
main()
    .then(() => { console.log("connection successful")})
    .catch((err) => {console.log(err)})

async function main(){
    await mongoose.connect(MONGO_URL)
}

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride("_method"))

app.engine('ejs', ejsMate) 

//listing
app.use("/listings", listings)
// review
app.use("/listings/:id/reviews", reviews)

//root route
app.get("/", (req, res) => {
    // res.send("At root")
    res.redirect("/listings")
})

app.all("/*any", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"))
})

app.use((err, req, res, next) => {
    let {status=500, message="Some error occour"} = err
    res.status(status).render("error.ejs", {message})
})

app.listen(8080, ()=>{
    console.log('server is runnig at http://localhost:8080/listings')
})
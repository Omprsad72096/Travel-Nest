const mongoose = require('mongoose')
const { data } = require("./data.js")
const Listing = require("../models/listing.js")


//connect with mongoose
const MONGO_URL = "mongodb://127.0.0.1:27017/TravelNest"
main()
    .then(() => { console.log("connection successful")})
    .catch((err) => {console.log(err)})

async function main(){
    await mongoose.connect(MONGO_URL)
}

const initDB = async () => {
    await Listing.deleteMany({})
    await Listing.insertMany(data)
    console.log("data was saved")
}

initDB()
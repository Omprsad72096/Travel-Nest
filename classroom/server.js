const express = require("express")
const app = express();
const users = require("./routes/user")
const posts = require("./routes/post")
const cookieParser = require("cookie-parser")

app.use(cookieParser("secretcode"))

app.get("/getSignedCookie", (req, res) => {
    res.cookie("made-in", "India", {signed: true})
    res.send("signed cookie set")
})

app.get("/verify", (req, res) => {
    console.log(req.signedCookies)
    res.send("verified")
})

app.get("/getCookies", (req, res) => {
    res.cookie("greet", "hello")
    res.cookie("madeIn", "India")
    res.send("sent you some cookies!")
})

app.get("/greet", (req, res) => {
    let {name = 'anonymous'} = req.cookies
    res.send(`Hi, ${name}`)
})

app.get("/", (req, res) => {
    console.dir(req.signedCookies)
    res.send("Hi, I am root!")
})

// USER
// every request on "/users" goes to users.js ("/users" mapped with user.js file)
app.use("/users", users)

// POSTS
// every request on "/posts" goes to post.js ("/posts" mapped with post.js file)
app.use("/posts", posts)


app.listen(3000, ()=> {
    console.log("server is runnig at http://localhost:3000/")
})
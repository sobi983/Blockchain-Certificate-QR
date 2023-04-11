const express = require("express")
const app = express()
const routes = require("./routes/routes")
const ejs = require("ejs")
const path = require('path')
const {pageError}= require("./middleware/notFound")
const {noError} = require('./middleware/noError')
const { notDeepEqual } = require("assert")


app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'view'))

app.use(routes) //routes
// app.use(noError)
app.use(pageError) //middleware

app.listen(3000, (err)=>{
    if(err) console.log(err)
    return console.log("Server Listening @3000")
})






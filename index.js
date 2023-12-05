
require("./Model/");
const path    = require("path");
const express = require("express");
const ejsMate = require("ejs-mate");
const session      = require("express-session");
const cookieParser = require("cookie-parser");
const isLoggedIn = require("./isloggedin");


const app = express();

const sessionConfig = {
    secret: "thisIsASecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 7000 * 60 * 60 *24 * 7,
        maxAge:7000 * 60 * 60 *24 * 7
    },
}

app.use(session(sessionConfig));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"public")));
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(cookieParser());


const authRoutes = require("./Routes/auth");

app.get("/otp",(req,res)=>{
    res.render("message");
})

app.get("/home",isLoggedIn,(req,res)=>{
    res.render("home")
})

app.use("/",authRoutes);

app.listen("8081",()=>{
    console.log('Listening to PORT 8081');
})


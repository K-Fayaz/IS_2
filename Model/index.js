const mongoose = require("mongoose");



mongoose.connect('mongodb://127.0.0.1:27017/IS')
    .then((data)=>{
        console.log("Connected to database");
    })
    .catch((err)=>{
        console.log(err);
    })
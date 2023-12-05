const bcrypt  = require("bcrypt");
const express = require("express");
const User    = require("../Model/user");
const otpGenerator = require('otp-generator')
const sendgrid = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router  = express.Router();

const transporter = nodemailer.createTransport({
  service:'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "kfayaz1407@gmail.com",
    pass: "axpd ipxt amdl vmxc",
  },
});

// axpd ipxt amdl vmxc

// New 1: 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
// New 2 : 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
sendgrid.setApiKey('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');

var OTP = "";

const sendEmail = async (email,html)=>{
  const msg = {
     to: email,
     from: 'kfayaz1407@gmail.com',
     subject: 'Verify Your Email',
     html: `${html}`
   }

  try{
    let res = await sendgrid.send(msg);
    return res;
  }
  catch(err){
    return Error(err);
  }
}




let jsonwebtokenSECRET = 'this is a serios key';



router.get("/signup",(req,res)=>{
    res.render("signup");
});

router.post("/signup",async(req,res)=>{
    try{
        console.log(req.body);
        const user = await User.findOne({ email: req.body.email });
        if(!user)
        {
            const newUser = new User;
            newUser.username = req.body.username;
            newUser.email = req.body.email;
            newUser.password = await bcrypt.hash(req.body.password,8);

            await newUser.save();
            console.log(newUser);
            OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
            let message = `<h1>Here is your OTP to confirm your email! <spam style='color: green;'>${OTP}</spam></h1>`;
            console.log(req.body.email);

            const payload = {
                id: newUser._id,
                email: newUser.email,
            };

            let token = jwt.sign(payload,"SECRET",{
                expiresIn:"1d"
            });

            res.cookie("auth",token,{
                maxAge:24 * 60 * 60 * 1000,
                httpOnly: true
            })

            const info = await transporter.sendMail({
                from: {
                    name: 'Fayaz',
                    address:'kfayaz1407@gmail.com'
                },
                to: req.body.email, // list of receivers
                subject: "Verify your email!", // Subject line
                html: message, // html body
              });
            
              res.redirect('/otp');
            
        }else{
            res.redirect("/login");
        }
    }
    catch(err)
    {
        console.log(err);
    }
});


router.post("/login",async(req,res)=>{
    try{
        console.log(req.body);
        const user = await User.findOne({ email: req.body.email });
        if(user)
        {
            OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
            let message = `<h1>Here is your OTP to confirm your email! <spam style='color: green;'>${OTP}</spam></h1>`;
            console.log(req.body.email);

            const payload = {
                id: user._id,
                email: user.email,
            };

            let token = jwt.sign(payload,"SECRET",{
                expiresIn:"1d"
            });

            res.cookie("auth",token,{
                maxAge:24 * 60 * 60 * 1000,
                httpOnly: true
            })

            const info = await transporter.sendMail({
                from: {
                    name: 'Fayaz',
                    address:'kfayaz1407@gmail.com'
                },
                to: req.body.email, // list of receivers
                subject: "Verify your email!", // Subject line
                html: message, // html body
              });
            
              res.redirect('/otp');
            
        }else{
            res.redirect("/signup")
        }
    }
    catch(err)
    {
        console.log(err);
    }
})

router.post('/otp',(req,res)=>{
    const { otp } = req.body;
    if(otp == OTP)
    {
        res.redirect("/home");
    }else{
        res.redirect("/resend-otp");
    }
})

router.get("/otp",(req,res)=>{
    res.render("message")
});

router.get("/resend-otp",(req,res)=>{
    res.render("error");
});

router.post("/resend",async(req,res)=>{
    OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    let message = `<h1>Here is your OTP to confirm your email! <spam style='color: green;'>${OTP}</spam></h1>`;
    const info = await transporter.sendMail({
        from: {
            name: 'Fayaz',
            address:'kfayaz1407@gmail.com'
        },
        to: req.body.email, // list of receivers
        subject: "Verify your email!", // Subject line
        html: message, // html body
      });

    res.render("message");
})

router.get("/login",(req,res)=>{
    res.render("login");
});

router.post("/logout",(req,res)=>{
    try{
        const { auth } = req.cookies;
        if(auth)
        {
            console.log("required auth is ",auth);
            res.cookie('auth','',{
                httpOnly: true,
                maxAge: 1,
            });

            res.redirect("/login");
        }else{
            res.redirect("/login");
        }   
    }
    catch(err)
    {
        console.log("Somethign Went Wrong",err);
        res.redirect("/login");
    }
})

module.exports = router;
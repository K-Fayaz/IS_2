const jwt  = require("jsonwebtoken");
const User = require("./Model/user");

const isLoggedIn = async(req,res,next)=>{
    try{
        if(req.cookies.auth)
        {
            const payload = jwt.verify(req.cookies.auth,"SECRET");
            console.log(payload);
            const user = await User.findById(payload.id);
            if(user)
            {
                console.log(user);
                res.locals.authUser = user._id;
            }else{
                throw Error("User not Found");
            }
            next();
        }
        else{
            res.redirect("/login");
        }
    }
    catch(err)
    {
        console.log("Something Went Wrong",err);
    }
}

module.exports = isLoggedIn;
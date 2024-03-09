const jwt=require("jsonwebtoken");
require("dotenv").config();


const generateAdminToken=(checkAdmin,verificationCode)=>{
    return jwt.sign({checkAdmin,verificationCode},process.env.SECRET,{expiresIn:'1d'});
}

module.exports={generateAdminToken};



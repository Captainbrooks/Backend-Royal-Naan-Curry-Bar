const jwt=require("jsonwebtoken");
require("dotenv").config();


const generateToken=(id,role)=>{
    return jwt.sign({id,role},process.env.SECRET,{expiresIn:'1d'});
}

module.exports={generateToken};



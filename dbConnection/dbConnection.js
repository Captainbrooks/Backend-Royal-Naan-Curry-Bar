const mongoose=require("mongoose");
require("dotenv").config();


const connectDb=(req,res)=>{
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("Database connection is successful");
})
.catch((error)=>{
 console.log(error);
})
}


module.exports=connectDb;
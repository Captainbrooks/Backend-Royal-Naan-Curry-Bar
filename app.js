const express=require("express");
require("dotenv").config();

const app=express();
const cors=require("cors");
app.use(express.json({
    limit: '50mb'
  }));
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
const cookieParser = require('cookie-parser');

app.use(cookieParser());



const connectDb=require("./dbConnection/dbConnection");
const menuRoutes=require("./Routes/menuRoutes")
const userRoutes=require("./Routes/userRoutes");
const messageRoutes=require("./Routes/messageRoutes");
const adminRoutes=require("./Routes/adminRoutes");

app.use("/api/v1",adminRoutes);
app.use("/api/v1",menuRoutes);
app.use("/api/v1",userRoutes);
app.use("/api/v1",messageRoutes);




connectDb();





app.listen(process.env.PORT,()=>{
    console.log(`Server is running at ${process.env.PORT}`)
})
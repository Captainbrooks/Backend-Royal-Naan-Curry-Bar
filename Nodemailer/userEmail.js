const mongoose=require("mongoose");
const nodemailer=require("nodemailer");
const crypto=require("crypto");
const PasswordReset=require("../models/forgotPasswordModel");

const generatePasswordResetLink=async(email)=>{

    try {
      const resetlink = crypto.randomBytes(32).toString('hex');
  
  
     const hashedlink = crypto.createHash('sha256').update(resetlink).digest('hex');
    const link= await PasswordReset.create({
          email,
          link:hashedlink
      });

      return  link;
  
    } catch (error) {
   
      throw new Error('Failed to generate and save password reset link');
    }
  }





  const sendPasswordResetLink=async(email,url)=>{
    const passwordResetUrl = `https://royal-naancurry-and-cafe.onrender.com/api/v1/user/reset-password/?url=${url}&email=${email}`;
    try {
        const transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.ADMIN_EMAIL,
                pass:process.env.APP_PASSWORD
            }
        });


const mailOptions={
    from:process.env.ADMIN_EMAIL,
    to:email,
    subject:'Verification Link',
    html: `
    <html>
            <head>
                <style>
                    /* Inline CSS styles */
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        border-radius: 10px;
                        background-color: #ffffff;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .verification-code {
                        font-size: 24px;
                        font-weight: bold;
                        color: #333333;
                        border: 2px solid #cccccc;
                        padding: 10px;
                        background-color: #f9f9f9;
                        border-radius: 5px;
                    }
                    .message {
                        margin-top: 20px;
                        font-size: 16px;
                        color: #666666;
                    }

                    h2{
                        margin-bottom:30px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Password Reset</h2>
                    <p>Your Password Reset Link is: <span class="verification-Link">${passwordResetUrl}</span></p>
                    <p class="message">This link will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                </div>
            </body>
        </html>
    `
};


const isSent=await transporter.sendMail(mailOptions);

if(isSent){
    return {
        status:"success",
        message:"verification link sent"
    }
}

    } catch (error) {
     
        throw new Error('Failed to send verification email');
    }
}


const verifyPasswordResetLink=async(email,link)=>{
    try {

        const latestlink=await PasswordReset.findOne({email,used:false}).sort({createdAt:-1});

        console.log(latestlink);

        if(!latestlink || latestlink.link !== link){
            return false;
        }
        
        const tenMin=10 * 60 * 1000;
        const now=new Date();
        const linkExpirationTime=new Date(latestlink.createdAt.getTime() + tenMin);

        if(now > linkExpirationTime){
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error verifying password reset link:', error);
        throw new Error('Failed to verify password reset link');
    }
}








  module.exports={generatePasswordResetLink,sendPasswordResetLink,verifyPasswordResetLink}
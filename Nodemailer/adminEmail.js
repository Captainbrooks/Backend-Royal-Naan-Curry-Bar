const mongoose=require("mongoose");
const nodemailer=require("nodemailer");
const Admin=require("../models/adminVerificationModel");


const generateVerificationCode=async(email)=>{

  try {
    const code= Math.floor(100000 + Math.random() * 900000);

    await Admin.create({
        email,
        code
    });

    return code;

  } catch (error) {
    console.error('Error generating and saving verification code:', error);
    throw new Error('Failed to generate and save verification code');
  }
}



const sendVerificationEmail=async(email,verificationCode)=>{
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
    subject:'Verification Code',
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
                    <h2>Verification Code</h2>
                    <p>Your verification code is: <span class="verification-code">${verificationCode}</span></p>
                    <p class="message">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
                </div>
            </body>
        </html>
    `
};


const isSent=await transporter.sendMail(mailOptions);

if(isSent){
    return {
        status:"success",
        message:"required verification"
    }
}

    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
    }
}





const verifyVerificationCode=async(email,code)=>{
    try {

        console.log(code);
        const latestcode=await Admin.findOne({email}).sort({createdAt:-1});

        console.log("latest code is " ,latestcode);

        if(!latestcode || latestcode.code !== code){
            return false;
        }


        const tenMin=10 * 60 * 1000;
        const now=new Date();
        const codeExpirationTime=new Date(latestcode.createdAt.getTime() + tenMin);

        if(now > codeExpirationTime){
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error verifying verification code:', error);
        throw new Error('Failed to verify verification code');
    }
}







module.exports={generateVerificationCode,sendVerificationEmail, verifyVerificationCode};









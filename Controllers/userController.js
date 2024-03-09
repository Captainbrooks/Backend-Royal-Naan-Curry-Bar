const mongoose = require("mongoose");

const User = require("../models/userModel");

const updatePassword=require("../models/userModel");
const { generateToken } = require("../Authentication/token");
const { generateAdminToken } = require("../Authentication/adminToken");

const { generateVerificationCode, sendVerificationEmail, verifyVerificationCode } = require("../Nodemailer/adminEmail");
const { generateVerificationLink, sendverificationLink, verifyVerificationLink, generatePasswordResetLink, sendPasswordResetLink,verifyPasswordResetLink } = require("../Nodemailer/userEmail");
const Reservation = require("../models/reservationModel");

const bcrypt=require("bcryptjs");

const PasswordReset=require("../models/forgotPasswordModel");






const SignUp = async (req, res) => {

    const { username, email, password, phone, confirmPassword } = req.body;




    let role = 'user';

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD && confirmPassword === process.env.ADMIN_PASSWORD) {
        role = 'admin';
    }


    try {

        const newUser = await User.signup(username, email, phone, password, confirmPassword, role);

        if (!newUser) {
            return res.status(400).json({
                status: "failed",
                message: "Couldn't create a user"
            });
        }

        const token = generateToken(newUser._id, newUser.role);

        console.log(newUser.role);
        console.log(token);

        res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        res.status(201).json({
            status: "Success",
            newUser,
            token
        })


    } catch (error) {

        console.log(error);

        res.status(500).json({
            status: "failed",
            error: error.message
        })
    }
}


const Login = async (req, res) => {
    const { email, password } = req.body;

    console.log(email)

    try {

        const user = await User.login(email, password);

        let isAdmin = false;

        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "Couldn't found the user with such email and password"
            })
        }

        if ((email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) || user.role === 'admin') {
            isAdmin = true;
        }

        if (isAdmin) {
            console.log("is admin is true and email is ", email);
            const code = await generateVerificationCode(email);


            const sentEmail = await sendVerificationEmail(email, code);



            if (sentEmail) {
                return res.status(200).json({
                    status: "success",
                    error: sentEmail.message
                })
            }

        }

        const token = generateToken(user._id, user.role);


        res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });



        res.status(200).json({
            status: "success",
            user,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed",
            error: error.message
        })
    }
}


const bookReservation = async (req, res) => {
    const { name, email, date, time, persons, phone } = req.body;

    console.log(req.body);

    try {
        if (!req.body) {
            return res.status(404).json({
                status: "failed",
                error: "Invalid Input"
            })
        }

        const newReservations = await Reservation.create({
            name,
            email,
            date,
            time,
            persons,
            phone
        })

        if (!newReservations) {
            return res.status(404).json({
                status: "failed",
                error: "Couldn't book a reservation. Try again"
            })
        }

        console.log(newReservations);

        res.status(200).json({
            status: "success",
            newReservations,
            message: "Reservation Booking Successfull"
        })
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: error.message
        })
    }
}




const forgotPassword = async (req, res) => {

    console.log("forgot password is reached");
    const { email } = req.body;

    console.log(email);


    try {
        // check if the user exists in the database

        const isUser = await User.find({ email:email });

        console.log(isUser);

        

        if (!isUser) {
            return res.status(404).json({
                status: "failed",
                error: "User not Found"
            })
        }

        console.log("user is there");



        // if user exists then

        const resetlink = await generatePasswordResetLink(email);

        console.log(resetlink.link);

       

        // send resetlink to the email

        const isSent = await sendPasswordResetLink(email, resetlink.link);
        console.log("link is sent", isSent);



        if (!resetlink || !isSent) {
            return res.status(500).json({
                status: "failed",
                error: "Something went wrong. Try again later"
            })
        }

        res.status(200).json({
            status: "success",
            message: `A Password Reset link is sent to the ${email}`
        })

    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: error.message
        })
    }
};


const verifyPasswordLink=async(req,res)=>{

    console.log("verify password is reached");
const {url,email}=req.query;

console.log(url,email);

try {
    const verified=await verifyPasswordResetLink(email,url);



    if(verified){
      return  res.redirect(`http://localhost:3000/reset-password/?email=${encodeURIComponent(email)}`);
    }
 

    console.log("not verified user");
  // If not verified, redirect to error page with error message
  const errorMessage = "The password reset link has expired or is invalid. Please request a new one.";
  return res.redirect(`http://localhost:3000/error?message=${encodeURIComponent(errorMessage)}`)

} catch (error) {
    res.status(500).json({
        status:"failed",
        error:error.message
    })
}
}



const resetPassword=async(req,res)=>{

    console.log("reset password is reset");
    const { email } = req.query;
    const {password,confirmPassword}=req.body;

    console.log(email,password,confirmPassword);

    try {


        const user=await User.find({email});

        if(!user){
           return res.status(404).json({
                status:"failed",
                error:"User not found"
            })
        }

        console.log(user);


        const hashedPassword=await bcrypt.hash(password,10);
        console.log(hashedPassword);

        const isChanged= await User.findOneAndUpdate(
            { email:email },
            { $set: { password: hashedPassword }},
            { new: true }
        );


        if(!isChanged){
            return res.status(400).json({
                status:"failed",
                error:"Couldn't change the password at this moment. Please try again"
            })
        }

        console.log("user password is changed", isChanged);



        const resetLink = await PasswordReset.findOneAndUpdate(
            { email, used: false },
            { $set: { used: true } }
        );

        if (!resetLink) {
            return res.status(404).json({
                status: "failed",
                error: "Password reset link not found or has already been used"
            });
        }


        console.log(resetLink);

        // if password change is success 
    
     
       if(isChanged){
        res.status(200).json({
            status:"success",
            message:"Password Reset is successfull"
        })
       }





        

    } catch (error) {
        res.status(500).json({
            status:"failed",
            error:error.message
        })
    }
}






module.exports = { SignUp, Login, bookReservation, forgotPassword,verifyPasswordLink,resetPassword };
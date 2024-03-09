
const {cloudinary}=require("../cloudinary/cloudinary.js")
const User = require("../models/userModel");
const Events = require("../models/EventsModel");
const Reservation=require("../models/reservationModel");
const { generateVerificationCode, sendVerificationEmail, verifyVerificationCode } = require("../Nodemailer/adminEmail")
const {generateAdminToken}=require("../Authentication/adminToken.js")


const resendCode = async (req, res) => {

    const { email } = req.body;

  
    try {

        const code = await generateVerificationCode(email);



        const isSent = await sendVerificationEmail(email, code);



        if (isSent) {
            return res.status(200).json({
                status: "success",
                error: isSent.message
            })
        }



        res.status(200).json({
            status: "success",
            code,
            resendMessage: `A new verification code has been sent to the email ${email}`
        })
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: error.message
        })
    }
}





const getAdminVerified = async (req, res) => {



    const { email, verificationCode } = req.body;


    let isadminverified = false;

    const isverifiedAdmin = await verifyVerificationCode(email, verificationCode)

    if (!isverifiedAdmin) {
        return res.status(400).json({
            status: "failed",
            error: "The verification code you entered is incorrect. Please double-check and re-enter the code"
        })
    } else {
        isadminverified = true;
        const adminToken = await generateAdminToken(isadminverified, verificationCode)

        res.cookie('jwt', adminToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({
            status: "success",
            adminToken,
            isadminverified,
            verificationCode
        })
    }
}




const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});

        if (users.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "No Users found"
            })
        }

        res.status(200).json({
            status: "success",
            count: users.length,
            users
        })
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            error: error.message
        })
    }
}






const makeAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOneAndUpdate(
            { _id: id },
            { $set: { role: 'admin' } },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({
                status: "failed",
                error: "Couldn't update as a admin"

            })
        }


        res.status(200).json({
            status: "success",
            user
        })
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: error.message
        })
    }
}



const deleteUser = async (req, res) => {


    const { id } = req.params;

    const admin = process.env.ADMIN_EMAIL;
    try {
        const delUser = await User.deleteOne({ _id: id, email: { $ne: admin } });

        if (delUser.deletedCount === 1) {
            return res.status(401).json({
                status: "success",
                message: "Deleted Successfully"
            })
        }
        if (!delUser) {
            return res.status(400).json({
                status: "failed",
                message: "Not Authoried or User not Found"
            })
        }

        res.status(200).json({
            status: "success",
            message: "Successfully deleted all the users except the admin"
        })
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: error.message
        })
    }
}




const addEvents = async (req, res) => {

    const { name, description, startTime, endTime } = req.body;

    const pic = req.body.image;

    const uploadedResponse = await cloudinary.uploader.upload_large(pic, {
        upload_preset: 'images_preset'
    });

    if (!uploadedResponse) {
        return res.status(500).json({
            status: "failed",
            error: error.message
        })
    }

    const { secure_url } = uploadedResponse;

    try {
        const newEvents = await Events.create({

            name,
            description,
            startTime,
            endTime,
            imgUrl: secure_url

        })

        if(!newEvents){
            return res.status(404).json({
                status:"failed",
                error:"Failed to Add Events"
            })
        }

        res.status(200).json({
            status:"success",
            message:"A new event has been added",
            newEvents
        })

    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: error.message
        })
    }
}

const getEvents = async (req, res) => {

    try {


        const events = await Events.find({ completed: false });


        if (events.length < 0) {
          return  res.status(404).json({
                status: "failed",
                error: "No Active Events"
            })
        }

        res.status(200).json({
            status: "success",
            events
        })
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: error.message
        })
    }

}


const updateEvents=async(req,res)=>{
    const { id } = req.params;

    try {
        const updatedEvents=await Events.findOneAndUpdate(
            { _id: id },
            { $set: { completed: true } },
            { new: true }
        )

        if(!updatedEvents){
return res.status(404).json({
    status:"failed",
    error:"couldn't update the Events"
})
        }

        res.status(200).json({
            status:"success",
            updatedEvents            
        })
    } catch (error) {
        res.status(500).json({
            status:"failed",
            error:error.message
        })
    }
}



const getReservations=async(req,res)=>{
    try {

        const reservations = await Reservation.find({completed:false});


        if (reservations.length < 0) {
          return  res.status(404).json({
                status: "failed",
                error: "No Active reservations"
            })
        }
        res.status(200).json({
            status: "success",
            reservations
        })
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: error.message
        })
    }
}


const updateReservations=async(req,res)=>{
    const { id } = req.params;


    console.log("update reservation is reached");

    console.log(id);
    try {
        const updatedReservations=await Reservation.findOneAndUpdate(
            { _id: id },
            { $set: { completed: true } },
            { new: true }
        )

        if(!updatedReservations){
return res.status(404).json({
    status:"failed",
    error:"couldn't update the Events"
})
        }

        console.log(updatedReservations);

        res.status(200).json({
            status:"success",
            updatedReservations            
        })
    } catch (error) {
        res.status(500).json({
            status:"failed",
            error:error.message
        })
    }
}




module.exports = { resendCode, getAdminVerified, getAllUsers, makeAdmin, deleteUser,addEvents, getEvents,updateEvents ,getReservations,updateReservations}


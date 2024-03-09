const mongoose=require("mongoose");
const Contact=require("../models/contactModel");
const Reservation=require("../models/reservationModel");




const getContact=async(req,res)=>{
    const {name,email,phone,message}=req.body;

    try {
        const newMessage=await Contact.create({name,email,phone,message});

        if(!newMessage){
            return res.status(400).json({
                status:"failed",
                message:"Couldn't send the message"
            })
        }
        console.log(newMessage);
res.status(201).json({
    status:"success",
    newMessage
})

    } catch (error) {
        res.status(500).json({
            status:"failed",
            error:error.message
        })
    }
}



const getReservation=async(req,res)=>{
    const {name,email,date,time,persons,phone}=req.body;

    try {
        const reservation=await Reservation.create({name,email,date,time,persons,phone});

        if(!reservation){
            return res.status(400).json({
                status:"failed",
                message:"Couldn't make a Reservation"
            })
        }
res.status(201).json({
    status:"success",
    reservation
})

    } catch (error) {
        res.status(500).json({
            status:"failed",
            error:error.message
        })
    }
}


module.exports={getContact,getReservation};

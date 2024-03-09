const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Required"],
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
    },
    date: {
        type: String,
        required: [true, "Date is Required"],
    },
    time:{
        type:String,
        required:[true,"Time is Required"],
    },
    persons: { 
        type: Number,
        required:true,
    },
    phone: {
        type: String,
        required: [true, "Phone is Required"],
    },
    completed:{
        type:Boolean,
        default:false
    }
});

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;

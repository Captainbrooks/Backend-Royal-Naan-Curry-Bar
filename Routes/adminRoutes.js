const express=require("express");
const router=express.Router();
const isAdmin = require("../Authentication/isAdmin");

const { deleteUser,getAdminVerified ,makeAdmin,getAllUsers,resendCode,addEvents,getEvents,updateEvents,getReservations,updateReservations} = require("../Controllers/adminController");
const Reservation = require("../models/reservationModel");




router.post("/user/verifyadmin",getAdminVerified)
router.post("/user/resend-code",resendCode);


router.delete("/user/delete/:id",isAdmin,deleteUser);

router.patch("/user/makeadmin/:id",isAdmin,makeAdmin)


router.get("/user/get-users",isAdmin,getAllUsers);

router.get("/events/active-events",getEvents);

router.post("/events/add-events",isAdmin,addEvents);

router.patch("/events/mark-complete/:id",isAdmin,updateEvents);

router.patch("/reservations/mark-complete/:id",isAdmin,updateReservations);


router.get("/reservations",isAdmin,getReservations);




module.exports=router
const express=require("express");

const router=express.Router();

const {getContact,getReservation} =require("../Controllers/messageController");


router.post('/contact',getContact);

router.post('/reservation',getReservation);


module.exports=router;
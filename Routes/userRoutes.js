const express=require("express");
const router=express.Router();


const {SignUp,Login,bookReservation,forgotPassword,verifyPasswordLink,resetPassword}=require("../Controllers/userController");



router.post("/user/signup",SignUp);
router.post("/user/login",Login);
router.post("/reservations/add-reservations",bookReservation);

router.post("/user/forgot-password",forgotPassword)

router.get("/user/reset-password",verifyPasswordLink);
router.post("/user/reset-password",resetPassword);

module.exports=router;






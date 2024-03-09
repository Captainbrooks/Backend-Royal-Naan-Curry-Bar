const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"UserName is Required"],
        maxlength:[100,"Username length cannot exceeds 100 Characters"],
        minlength:[3,"Username must be at least 3 characters"],
        unique:[true, "This username is already taken ! Try another one"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"This Email is already taken ! Try another one"]
    },
    phone:{
        type:String,
        required:false,
        unique:false
    },
    password:{
        type:String,
        required:[true,"Please enter a password"],
    },
    confirmPassword:{
        type:String,
        required:true,
        select:false
    },
    role:{
        type:String,
        required:false,
        enum:['user','admin'],
        default:'user',
    }
});



userSchema.statics.signup=async function(username,email,phone,password,confirmPassword,role){

    console.log(password);
    console.log(confirmPassword);


    if(!username || !email || !password || !confirmPassword){
        throw new Error("All fields must be filled. Try Again")
    }

    if(password !== confirmPassword){
        throw new Error("Password and confirm password didn't match. Try again !!!")
    }

 
    const isUsernameExists=await this.findOne({username});

  

    if(isUsernameExists){
        throw new Error("Username is already taken. Please try another")
    }

    const isEmailExists=await this.findOne({email});

    if(isEmailExists){
        throw new Error("This email is already registered. Try another one")
    }

 

    const salt =await bcrypt.genSalt(10);

    const hash=await bcrypt.hash(password,salt);
    console.log(hash);


    const user=await this.create({username,email,password:hash,confirmPassword,role});

  return user;
}






userSchema.statics.login=async function(email,password){

    if(!email || !password){
        throw new Error("All fields must be filled. Try Again")
    }

    const user=await this.findOne({email});
    // console.log(user);

    if(!user){
        throw new Error("Incorrect Email. Please Try again")
    }

    const match=await bcrypt.compare(password,user.password)

    if(!match){
        throw new Error("Incorrect Password.Please Try again")
    }

    return user
}




// userSchema.methods.updatePassword=async function(email,password,confirmPassword){


//     console.log("update password is reached");

//     console.log(password,confirmPassword,email);

//     if(!password || !confirmPassword){
//         throw new Error("Please enter both the password Fields.")
//     }

//     if(password !== confirmPassword){
//         throw new Error("Password and confirm password didn't match. Try again")
//     }

//     const user = await this.constructor.find({ email });

//     console.log(user);
//     if (!user) {
//         throw new Error("User not found with the provided email.");
//     }


//     const hashedPassword=await bcrypt.hash(password,10);
//     this.password=hashedPassword;
//   const isReset = await this.save();

//   if(!isReset){
//     throw new Error("Something went wrong.Please reseting your password again")
//   }

// return this;

// }


const User=new mongoose.model("User",userSchema);



module.exports=User;






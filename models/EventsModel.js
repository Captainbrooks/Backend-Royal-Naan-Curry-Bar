const mongoose=require("mongoose");

const EventsSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    imgUrl:{
        type:String
    },
    completed:{
        type:Boolean,
        default:false
    }
})


const Events=new mongoose.model("Events",EventsSchema);

module.exports=Events;

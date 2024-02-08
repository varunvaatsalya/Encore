const mongoose=require("mongoose");

mongoose.connect("mongodb://0.0.0.0:27017/Database")
.then(()=>{
    console.log("sever connected")
})
.catch(()=>{
    console.log("error")
});

const event = new mongoose.Schema({
  events:[
   type=String,
   required=true,
  ], 
});


const event_collection =new mongoose.model("events",event)

module.exports=event_collection;
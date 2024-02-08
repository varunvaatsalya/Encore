const mongoose=require("mongoose");

mongoose.connect("mongodb://0.0.0.0:27017/Database")
.then(()=>{
    console.log("server connected")
})
.catch(()=>{
    console.log("error")
});

const login = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    college:{
   type:String,
   required:true,
    },
    year:{
    type:Number,
    required:true,
    },
    age:{
    type:Number,
    required:true,
    },
    refcode:{
    type:String,
    },
    contact:{
        type:Number,
        required:true,
    },
    userid:{
    type:String,
    required:true,
    },
    password:{
        type:String,
        required:true
    },
    confpassword:{
        type:String,
        required:true
    },
    events:[{
            type: String
        }]

});


const collection=new mongoose.model("users",login)

module.exports=collection
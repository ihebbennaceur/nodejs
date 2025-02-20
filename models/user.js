const mongoose=require("mongoose");


const userSchema=new mongoose.Schema(


    {
        name:String,
        lastname:String,
     email:{required:true,unique:true,type:String}  ,
     password:String,
    }
)

module.exports=mongoose.model('User',userSchema)
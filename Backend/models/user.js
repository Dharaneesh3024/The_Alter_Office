const mongoose=require('mongoose')
const User= new mongoose.Schema(
{
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    }

})
module.exports=new mongoose.model("User",User)
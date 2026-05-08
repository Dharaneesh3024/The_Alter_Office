const express=require('express')
const cors=require('cors')
const dotenv=require('dotenv')
const app=express()
const User=require("./models/user")
const Todo=require("./models/list")
const user = require('./models/user')
dotenv.config()
app.use(cors())
app.use(express.json())
port=5000
app.post("/api/signup",async(req,res)=>{
    const user=new User(
        user.email=req.body.name,
        user.password=req.body.password
    )
})
app.post("/api/login",async(req,res)=>{
    const {email,password}=req.body;
    const original_password=user.password;
    try{
        if(original_password===password){
            const data=await fetch(`/api/User:${user.id}`)
            res.json(data);
            res.statusMessage("Logged in Successful");
        }
    }
    catch(err){
        console.log(`Error fetching results: ${err}`);
    }
})

app.listen(port,()=>{
    console.log(`server running on port ${port}`);
})
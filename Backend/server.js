const express=require('express')
const cors=require('cors')
const dotenv=require(dotenv)
const app=express()
const User=require("./models/user")
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
app.listen(port,()=>{
    console.log(`server running on port ${port}`);
})
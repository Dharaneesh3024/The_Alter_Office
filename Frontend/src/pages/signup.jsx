import React from "react";
import { useState,useEffect } from "react";
import "./signup.css"
function Signup(){
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")

    const submit=(e)=>{
        alert("Submitted")
        e.preventDefault();
        setName(" ")
        setPassword(" ")
    }
    return(
        <>
        <div className="signup_form">
        <form onSubmit={submit}>
            <label>Email : </label>
            <input type="email" required value={email}
            onChange={(e)=>{setName(e.target.value)}}
            ></input><br/><br/>
            <label> Password : </label>
            <input type="password" required value={password}
            onChange={(e)=>{setPassword(e.target.value)}}>
            </input><br/>
            <button type="submit">Submit</button>
        </form>

        </div>
        </>
    )
}
export default Signup;
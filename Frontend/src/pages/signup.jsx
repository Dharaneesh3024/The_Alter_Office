import React from "react";
import { useState,useEffect } from "react";
function Signup(){
    const[name,setName]=useState("")
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
            <input type="email" required
            onChange={(e)=>{setName(e.target.value)}}
            ></input>
            <input type="password" required
            onChange={(e)=>{setPassword(e.target.value)}}>
            </input>
            <button type="submit">Submit</button>
        </form>

        </div>
        </>
    )
}
export default Signup;
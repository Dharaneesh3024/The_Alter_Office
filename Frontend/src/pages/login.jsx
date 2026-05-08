import React from "react";
import { useState,useEffect } from "react";
function Login(){
        return(
            <>
                <form>
                    <label>Email : </label>
            <input type="email" required></input><br/><br/>
            <label> Password : </label>
            <input type="password" required>
            </input><br/>
            <button type="submit">Submit</button>
                    
                </form>
            </>
        )
}
export default Login;
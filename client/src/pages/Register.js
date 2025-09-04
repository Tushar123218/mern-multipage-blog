import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { saveAuth } from "../utils/auth";

export default function Register(){
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try{
     const data = await API.post("/auth/register", { username, email, password });

      // expected: { token, user }
      saveAuth(data.token, data.user);
      navigate("/");
    }catch(e){
      setErr(e.message || "Register failed");
    }
  };

  return (
    <div style={{display:"flex", justifyContent:"center"}}>
      <form className="card" onSubmit={submit} style={{width:420}}>
        <h2 className="center">Register</h2>
        {err && <div style={{color:"red"}}>{err}</div>}
        <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
        <div style={{display:"flex", justifyContent:"flex-end"}}>
          <button type="submit" style={{background:"#10b981", color:"white"}}>Register</button>
        </div>
      </form>
    </div>
  );
}

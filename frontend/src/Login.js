import './Login.css';    
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = async () => {
  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  try {
    await axios.post("http://localhost:5000/login", { email, password }, { withCredentials: true });
    window.location.href = "/journal";
  } catch {
    alert("Invalid email or password");
  }
};

  };

  return (
<div className="container">
  <h2>Login</h2>
  <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
  <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
  <button onClick={login}>Login to Your Journal</button>
  <p>Don't have an account? <a href="/register">Register</a></p>
</div>

  );
}

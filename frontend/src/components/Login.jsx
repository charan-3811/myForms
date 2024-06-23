import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { user,setUser } = useContext(UserContext);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post("https://myformsbackend.onrender.com/login", {
                email: email,
                password: password,
            });

            if (response.status === 200) {
                sessionStorage.setItem("user", email);
                setUser(email);
                navigate("/home");
            } else if (response.data === "wrong details") {
                alert("Incorrect password or email");
            } else {
                alert("Server error. Try again later.");
            }
        } catch (err) {
            alert("Server error");
            console.error(err);
        }
    }
    if(!user==='None')
    {
        return(
            <div>
                <p>You have already logged in <Link to={'/home'}>home</Link> </p>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'black' }}>
            <h1>LOGIN</h1>
            <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', color: 'black',
                minHeight: '50%', minWidth: '50%',
                display:"flex",flexDirection:'column',
                alignItems:"center",padding:'1rem'
            }}>
                <label>
                    Email
                </label>

                <input
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    style={{minHeight:'2rem',width:'70%'}}
                />
               <br/>
                <label>
                    Password
                </label>
                <input
                    type="password"
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    style={{minHeight:'2rem',width:'70%'}}
                />
                <br />
                <button type="submit">SUBMIT</button>
            </form>
            <p>
                New user? <Link to="/signup">SIGNUP</Link>
            </p>
        </div>
    );
}

export default Login;

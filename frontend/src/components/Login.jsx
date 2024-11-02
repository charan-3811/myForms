import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation(); // Get the previous route
    const { user, setUser } = useContext(UserContext);

    // Get the originally requested page or default to "/home"
    const from = location.state?.from?.pathname || "/home";

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/login", {
                email: email,
                password: password,
            });

            if (response.status === 200) {
                sessionStorage.setItem("user", email);
                setUser(email);
                // Navigate to the originally requested route or home page
                navigate(from, { replace: true });
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

    // If the user is already logged in, display a message with a link to home
    if (user!='None') {
        return (
            <div>
                <p>
                    You are already logged in. Go to <Link to="/home">Home</Link>.
                </p>
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'black',
            }}
        >
            <h1>LOGIN</h1>
            <form
                onSubmit={handleSubmit}
                style={{
                    backgroundColor: 'white',
                    color: 'black',
                    minHeight: '50%',
                    minWidth: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '1rem',
                }}
            >
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ minHeight: '2rem', width: '70%' }}
                />
                <br />
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ minHeight: '2rem', width: '70%' }}
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

import  { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function Signup() {
    const [details, setDetails] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/signup", details);
            console.log(response.data);
            if (response.data === "Added successfully") {
                sessionStorage.setItem("user", details.email);
                setUser(details.email);
                navigate("/home");
            } else {
                alert("Failed to add user");
            }
        } catch (error) {
            console.error("There was an error submitting the form!", error);
            alert("Server error");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'black' }}>
            <h1>SIGNUP</h1>
            <form onSubmit={handleSubmit} 
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
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={details.name}
                    onChange={handleChange}
                    style={{ minHeight: '2rem', width: '70%' }}
                />
                <br />
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={details.email}
                    onChange={handleChange}
                    style={{ minHeight: '2rem', width: '70%' }}
                />
                <br />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={details.password}
                    onChange={handleChange}
                    style={{ minHeight: '2rem', width: '70%' }}
                />
                <br />
                <button type="submit">SUBMIT</button>
            </form>
        </div>
    );
}

export default Signup;

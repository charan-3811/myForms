// src/components/Signup.jsx
import React, { useState, useContext } from "react";
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
                navigate("/home"); // Navigate to home page after successful signup
            } else {
                alert("Failed to add user");
            }
        } catch (error) {
            console.error("There was an error submitting the form!", error);
            alert("Server error");
        }
    };

    return (
        <div>
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={details.name}
                    onChange={handleChange}
                />
                <br />
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={details.email}
                    onChange={handleChange}
                />
                <br />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={details.password}
                    onChange={handleChange}
                />
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Signup;

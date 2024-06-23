import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function FormResponse() {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState([]); // Array to store responses
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/form/${id}`);
                if (res.status === 200) {
                    setForm(res.data);
                    // Initialize responses array based on number of questions
                    setResponses(new Array(res.data.questions.length).fill(null));
                }
            } catch (error) {
                console.error("Error fetching form data:", error);
            }
        };

        fetchForm();
    }, [id]);

    const handleResponseChange = (qIndex, value) => {
        const updatedResponses = [...responses];
        updatedResponses[qIndex] = value;
        setResponses(updatedResponses);
    };

    const handleOptionChange = (qIndex, oIndex, checked) => {
        const updatedResponses = [...responses];
        if (!updatedResponses[qIndex]) {
            updatedResponses[qIndex] = [];
        }
        if (checked) {
            updatedResponses[qIndex].push(form.questions[qIndex].options[oIndex]);
        } else {
            updatedResponses[qIndex] = updatedResponses[qIndex].filter(
                option => option !== form.questions[qIndex].options[oIndex]
            );
        }
        setResponses(updatedResponses);
    };

    const submitResponses = async () => {
        try {
            const responseToSubmit = responses.map((response, index) => ({
                question: form.questions[index].name,
                answer: response,
            }));

            const res = await axios.post(`http://localhost:4000/form/${id}/response`, {
                responses: responseToSubmit,
                email: user
            });
            if (res.status === 200) {
                alert("Responses submitted successfully!");
                navigate("/home");
            }
        } catch (error) {
            console.error("Error submitting responses:", error);
        }
    };

    if (!form) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "white",
            color: "black",
            marginTop: "1rem",
            width: "50%",
            margin: "auto" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>{form.title}</h1>
            <p style={{ marginBottom: "1rem" }}>{form.description}</p>
            <ol style={{ padding: 0 }}>
                {form.questions.map((question, qIndex) => (
                    <li key={qIndex} style={{ border: "solid grey", borderRadius: "5px",
                        padding: "0.5rem", marginBottom: "1rem", width: "100%", boxShadow: "5px 1px #888888" }}>
                        <p style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{question.name}</p>
                        {question.ansType === "single option" && (
                            <div style={{ marginBottom: "0.5rem" }}>
                                {question.options.map((option, oIndex) => (
                                    <div key={oIndex} style={{ marginBottom: "0.3rem" }}>
                                        <input
                                            type="radio"
                                            name={`question-${qIndex}`}
                                            value={option}
                                            onChange={(e) => handleResponseChange(qIndex, option)}
                                        />
                                        <label>{option}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                        {question.ansType === "multi options" && (
                            <div style={{ marginBottom: "0.5rem" }}>
                                {question.options.map((option, oIndex) => (
                                    <div key={oIndex} style={{ marginBottom: "0.3rem" }}>
                                        <input
                                            type="checkbox"
                                            value={option}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.checked)}
                                        />
                                        <label>{option}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                        {question.ansType === "numeric" && (
                            <input
                                type="number"
                                onChange={(e) => handleResponseChange(qIndex, e.target.value)}
                                style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
                            />
                        )}
                        {question.ansType === "text" && (
                            <input
                                type="text"
                                onChange={(e) => handleResponseChange(qIndex, e.target.value)}
                                style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
                            />
                        )}
                    </li>
                ))}
            </ol>
            <button onClick={submitResponses} style={{ padding: "0.5rem 1rem", fontSize: "1rem", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>Submit</button>
        </div>
    );
}

export default FormResponse;

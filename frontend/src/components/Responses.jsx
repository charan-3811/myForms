import  { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function Responses() {
    const [responses, setResponses] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/form/${id}`);
                if (response.status === 200) {
                    setResponses(response.data.responses || []);
                }
            } catch (e) {
                alert("Unable to fetch the data");
                console.error(e);
            }
        };

        fetchForm();
    }, [id]);

    const handleNavResponses = () => {
        navigate(`/viewResponses/${id}`);
    };

    const handleNavQuestions = () => {
        navigate(`/viewQuestions/${id}`);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "1rem", color: "black", maxWidth: "100%" }}>
            <div style={{ marginBottom: "1rem" }}>
                <button style={{ marginRight: "0.5rem", padding: "0.5rem 1rem", fontSize: "1rem" }} onClick={handleNavQuestions}>
                    Questions
                </button>
                <button style={{ padding: "0.5rem 1rem", fontSize: "1rem" }} onClick={handleNavResponses}>
                    Responses
                </button>
            </div>

            <p style={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "0.5rem" }}>Responses</p>

            {responses.map((response, responseIndex) => (
                <div key={responseIndex} style={{ marginBottom: "1rem", textAlign: "left", border: "1px solid grey", boxShadow: "5px 1px #888888", borderRadius: "5px", padding: "1rem", width: "50%", backgroundColor: "white" }}>
                    <p style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>Email: {response.email}</p>
                    
                    {response.answers.map((section, sectionIndex) => (
                        <div key={sectionIndex} style={{ marginBottom: "1rem" }}>
                            <p style={{ fontWeight: "bold", textDecoration: "underline" }}>Section: {section.section}</p>
                            {section.questions.map((question, questionIndex) => (
                                <div key={questionIndex} style={{ marginBottom: "0.5rem" }}>
                                    <p>{questionIndex + 1}. {question.question}</p>
                                    <p style={{ marginLeft: "1rem" }}>Answer: {Array.isArray(question.answer) ? question.answer.join(', ') : question.answer}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Responses;

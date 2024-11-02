import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function FormResponse() {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState([]);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const styles = getStyles();

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/form/${id}`);
                if (res.status === 200) {
                    setForm(res.data);
                    // Initialize responses structure by section
                    const initialResponses = res.data.sections.map(section => ({
                        sectionTitle: section.title,
                        sectionResponses: section.questions.map(() => null)
                    }));
                    setResponses(initialResponses);
                }
            } catch (error) {
                console.error("Error fetching form data:", error);
            }
        };

        fetchForm();
    }, [id]);

    const handleResponseChange = (sectionIndex, qIndex, value) => {
        const updatedResponses = [...responses];
        updatedResponses[sectionIndex].sectionResponses[qIndex] = value;
        setResponses(updatedResponses);
    };

    const handleOptionChange = (sectionIndex, qIndex, oIndex, checked) => {
        const updatedResponses = [...responses];
        if (!updatedResponses[sectionIndex].sectionResponses[qIndex]) {
            updatedResponses[sectionIndex].sectionResponses[qIndex] = [];
        }
        if (checked) {
            updatedResponses[sectionIndex].sectionResponses[qIndex].push(form.sections[sectionIndex].questions[qIndex].options[oIndex]);
        } else {
            updatedResponses[sectionIndex].sectionResponses[qIndex] = updatedResponses[sectionIndex].sectionResponses[qIndex].filter(
                option => option !== form.sections[sectionIndex].questions[qIndex].options[oIndex]
            );
        }
        setResponses(updatedResponses);
    };

    const clearResponse = (sectionIndex, qIndex) => {
        const updatedResponses = [...responses];
        updatedResponses[sectionIndex].sectionResponses[qIndex] = null;
        setResponses(updatedResponses);
    };

    const submitResponses = async () => {
        try {
            const responseToSubmit = responses.map((sectionResponse, sectionIndex) => ({
                section: form.sections[sectionIndex].title,
                questions: sectionResponse.sectionResponses.map((response, questionIndex) => ({
                    question: form.sections[sectionIndex].questions[questionIndex].name,
                    answer: response,
                }))
            }));

            const res = await axios.post(`http://localhost:4000/form/${id}/response`, {
                responses: responseToSubmit,
                email: user,
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
        <div style={styles.container}>
            <h1 style={styles.title}>{form.title}</h1>
            <p style={styles.description}>{form.description}</p>
            {form.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} style={styles.sectionContainer}>
                    <h2 style={styles.sectionTitle}>{section.title}</h2>
                    <p style={styles.sectionDescription}>{section.description}</p>
                    <ol style={styles.questionList}>
                        {section.questions.map((question, qIndex) => (
                            <li key={qIndex} style={styles.questionItem}>
                                <div style={styles.questionHeader}>
                                    <p style={styles.questionText}>{question.name}</p>
                                    <button 
                                        onClick={() => clearResponse(sectionIndex, qIndex)} 
                                        style={styles.clearButton}
                                    >
                                        Clear
                                    </button>
                                </div>
                                {question.ansType === "single option" && (
                                    <div style={styles.option}>
                                        {question.options.map((option, oIndex) => (
                                            <div key={oIndex} style={styles.option}>
                                                <input
                                                    type="radio"
                                                    name={`question-${sectionIndex}-${qIndex}`}
                                                    value={option}
                                                    checked={responses[sectionIndex].sectionResponses[qIndex] === option}
                                                    onChange={() => handleResponseChange(sectionIndex, qIndex, option)}
                                                />
                                                <label>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {question.ansType === "multi options" && (
                                    <div style={styles.option}>
                                        {question.options.map((option, oIndex) => (
                                            <div key={oIndex} style={styles.option}>
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    checked={responses[sectionIndex].sectionResponses[qIndex]?.includes(option) || false}
                                                    onChange={(e) => handleOptionChange(sectionIndex, qIndex, oIndex, e.target.checked)}
                                                />
                                                <label>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {question.ansType === "numeric" && (
                                    <input
                                        type="number"
                                        value={responses[sectionIndex].sectionResponses[qIndex] || ""}
                                        onChange={(e) => handleResponseChange(sectionIndex, qIndex, e.target.value)}
                                        style={styles.input}
                                    />
                                )}
                                {question.ansType === "text" && (
                                    <input
                                        type="text"
                                        value={responses[sectionIndex].sectionResponses[qIndex] || ""}
                                        onChange={(e) => handleResponseChange(sectionIndex, qIndex, e.target.value)}
                                        style={styles.input}
                                    />
                                )}
                                {
                                    question.ansType === "date" && (
                                        <input 
                                            type="date"
                                            value={responses[sectionIndex].sectionResponses[qIndex] || ""}
                                            onChange={(e) => handleResponseChange(sectionIndex, qIndex, e.target.value)}
                                            style={styles.input}
                                        />
                                    )}
                            </li>
                        ))}
                    </ol>
                </div>
            ))}
            <button onClick={submitResponses} style={styles.submitButton}>Submit</button>
        </div>
    );
}

export default FormResponse;

function getStyles() {
    return {
        container: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "white",
            color: "black",
            marginTop: "1rem",
            width: "75%",
            margin: "auto",
        },
        title: {
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
        },
        description: {
            marginBottom: "1rem",
        },
        sectionContainer: {
            border: "solid #ddd",
            borderRadius: "5px",
            padding: "1rem",
            marginBottom: "1rem",
            width: "75%",
            boxShadow: "5px 1px #888888",
        },
        sectionTitle: {
            fontSize: "1.3rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
        },
        sectionDescription: {
            marginBottom: "1rem",
        },
        questionList: {
            padding: '1rem',
            width: '75%',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',

        },
        questionItem: {
            padding: "0.5rem",
            marginBottom: "1rem",
            width: "100%",
            border: "solid grey",
            borderRadius: "5px",
        },
        questionHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
        },
        questionText: {
            fontSize: "1.2rem",
            fontWeight: "bold",
        },
        option: {
            marginBottom: "0.3rem",
            alignItems: "center",
        },
        input: {
            width: "75%",
            padding: "0.5rem",
            marginBottom: "0.5rem",
        },
        submitButton: {
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
        },
        clearButton: {
            padding: "0.2rem 0.5rem",
            fontSize: "0.8rem",
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
        },
    };
}

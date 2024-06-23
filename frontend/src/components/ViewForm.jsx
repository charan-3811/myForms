import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ViewForm = () => {
    const { user } = useContext(UserContext);
    const [questions, setQuestions] = useState([]);
    const [title, setTitle] = useState("Untitled Form");
    const [description, setDescription] = useState("");
    const [responses, setResponses] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/form/${id}`);
                if (response.status === 200) {
                    const { title, description, questions, responses = [] } = response.data;
                    setTitle(title);
                    setDescription(description);
                    setQuestions(questions);
                    setResponses(responses);
                }
            } catch (error) {
                alert("Unable to fetch the data");
                console.error(error);
            }
        };
        fetchForm();
    }, [id]);

    const addQuestion = () => {
        setQuestions([...questions, { name: "", ansType: "single option", options: [] }]);
    };

    const saveForm = async () => {
        try {
            const response = await axios.post(`http://localhost:4000/updateForm`, {
                id,
                title,
                description,
                questions,
            });
            if (response.status === 200) {
                alert("Form updated successfully!");
                navigate('/home')
            }
        } catch (error) {
            console.error("Error saving form:", error);
            alert("Failed to save form. Please try again.");
        }
    };

    const clearForm = () => {
        setTitle("Untitled Form");
        setDescription("");
        setQuestions([]);
    };

    const handleQuestionChange = (index, value) => {
        const updatedQuestions = questions.map((q, i) =>
            i === index ? { ...q, name: value } : q
        );
        setQuestions(updatedQuestions);
    };

    const handleAnswerTypeChange = (index, value) => {
        const updatedQuestions = questions.map((q, i) =>
            i === index ? { ...q, ansType: value, options: [] } : q
        );
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updatedQuestions = questions.map((q, i) =>
            i === qIndex
                ? { ...q, options: q.options.map((opt, j) => (j === oIndex ? value : opt)) }
                : q
        );
        setQuestions(updatedQuestions);
    };

    const addOption = (index) => {
        if (questions[index].options.length < 4) {
            const updatedQuestions = questions.map((q, i) =>
                i === index ? { ...q, options: [...q.options, ""] } : q
            );
            setQuestions(updatedQuestions);
        } else {
            alert("Can only add up to 4 options");
        }
    };

    const removeOption = (qIndex, oIndex) => {
        const updatedQuestions = questions.map((q, i) =>
            i === qIndex ? { ...q, options: q.options.filter((_, j) => j !== oIndex) } : q
        );
        setQuestions(updatedQuestions);
    };

    const handleDeleteQuestion = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
    };

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const reorderedQuestions = Array.from(questions);
        const [movedItem] = reorderedQuestions.splice(result.source.index, 1);
        reorderedQuestions.splice(result.destination.index, 0, movedItem);
        setQuestions(reorderedQuestions);
    };

    const handleNavResponses = () => {
        navigate(`/viewResponses/${id}`);
    };

    const handleNavQuestions = () => {
        navigate(`/viewQuestions/${id}`);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "1rem" }}>

            {/*questions and responses*/}

            <div style={{ marginBottom: "1rem" }}>
                <button onClick={handleNavQuestions}>Questions</button>
                <button onClick={handleNavResponses}>Responses</button>
            </div>


            <div style={{ width: "100%", maxWidth: "600px", textAlign: "center" }}>
                {/*Title*/}
                <input
                    type="text"
                    value={title}
                    placeholder="Enter the title"
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
                />
                {/*Description*/}
                <input
                    type="text"
                    value={description}
                    placeholder="Enter the Description"
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
                />
                {/*form functionalities*/}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
                    <button onClick={addQuestion} style={{ marginRight: "0.5rem" }}>ADD QUESTION</button>
                    <button onClick={saveForm} style={{ marginRight: "0.5rem" }}>Save</button>
                    <button onClick={clearForm}>Clear</button>
                </div>

                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId={`${questions}`}>
                        {(provided) => (
                            <ol
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{ padding: 0, margin: 0, listStyleType: 'number', display: "flex",
                                    flexDirection: "column", alignItems: "center" }}
                            >

                                {/*mapping questions*/}

                                {questions.map((question, qIndex) => (
                                    <Draggable key={qIndex} draggableId={`question-${qIndex}`} index={qIndex}>
                                        {(provided) => (
                                            <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    marginTop: '1rem',
                                                    border: 'solid',
                                                    borderColor: 'grey',
                                                    boxShadow: '5px 1px #888888',
                                                    padding: "1rem",
                                                    backgroundColor: 'white',
                                                    color: 'black',
                                                    width: "100%",
                                                    maxWidth: "500px",
                                                    ...provided.draggableProps.style,
                                                }}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between",
                                                    alignItems: "center", marginBottom: "0.5rem" }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter the question"
                                                        value={question.name}
                                                        onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                                        style={{ flex: 1, marginBottom: "0.5rem", padding: "0.5rem" }}
                                                    />
                                                    <button onClick={() => handleDeleteQuestion(qIndex)} style={{ marginLeft: "0.5rem" }}>Delete</button>
                                                </div>
                                                <select
                                                    value={question.ansType}
                                                    onChange={(e) => handleAnswerTypeChange(qIndex, e.target.value)}
                                                    style={{ width: "max-content", marginBottom: "0.5rem", padding: "0.5rem" }}
                                                >
                                                    <option value="single option">Single Option</option>
                                                    <option value="multi options">Multi Options</option>
                                                    <option value="numeric">Numeric</option>
                                                    <option value="text">Text</option>
                                                </select>

                                                {["single option", "multi options"].includes(question.ansType) && (
                                                    <>
                                                        {question.options.length < 4 && (
                                                            <button onClick={() => addOption(qIndex)}>Add Option</button>
                                                        )}
                                                        {question.options.map((option, oIndex) => (
                                                            <div key={oIndex} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter option"
                                                                    value={option}
                                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                                    style={{ flex: 1, marginBottom: "0.5rem", padding: "0.5rem" }}
                                                                />
                                                                <button onClick={() => removeOption(qIndex, oIndex)} style={{ marginLeft: "0.5rem" }}>Remove</button>
                                                            </div>
                                                        ))}

                                                    </>
                                                )}
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ol>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
};

export default ViewForm;

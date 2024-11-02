import  { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function NewForm() {
    const { user } = useContext(UserContext);
    const [questions, setQuestions] = useState([]);
    const [title, setTitle] = useState("Untitled Form");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [display, setDisplay] = useState("questions");

    const addQuestion = () => {
        setQuestions(prevQuestions => [
            ...prevQuestions,
            { name: "", ansType: "single option", options: [] },
        ]);
    };

    const handleDeleteQuestion = (index) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions.splice(index, 1);
            return updatedQuestions;
        });
    };

    const saveForm = async () => {
        try {
            const response = await axios.post("http://localhost:4000/newForm", {
                user: user,
                title: title,
                description: description,
                questions: questions,
            });
            if (response.status === 200) {
                alert("Form added successfully!");
                navigate("/home");
            }
        } catch (error) {
            console.error("Error saving form:", error);
            alert("Failed to add form. Please try again.");
        }
    };

    const clearForm = () => {
        setTitle("Untitled Form");
        setDescription("");
        setQuestions([]);
    };

    const handleQuestionChange = (index, value) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[index].name = value;
            return updatedQuestions;
        });
    };

    const handleAnswerTypeChange = (index, value) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[index].ansType = value;
            updatedQuestions[index].options = []; 
            return updatedQuestions;
        });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[qIndex].options[oIndex] = value;
            return updatedQuestions;
        });
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
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[qIndex].options.splice(oIndex, 1);
            return updatedQuestions;
        });
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        setQuestions(prevQuestions => {
            const items = Array.from(prevQuestions);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);
            return items;
        });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "1rem" }}>
            {display === "questions" && (
                <div style={{ width: "100%", maxWidth: "600px", textAlign: "center" }}>
                    <input
                        type="text"
                        value={title}
                        placeholder="Enter the title"
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
                    />
                    <input
                        type="text"
                        value={description}
                        placeholder="Enter the Description"
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
                    />

                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
                        <button onClick={addQuestion} style={{ marginRight: "0.5rem" }}>ADD QUESTION</button>
                        <button onClick={saveForm} style={{ marginRight: "0.5rem" }}>Save</button>
                        <button onClick={clearForm}>Clear</button>
                    </div>

                    {/* questions*/}
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId={`${questions}`}>
                            {(provided) => (
                                <ol
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{ padding: 0, margin: 0, listStyleType: 'none' }}
                                >
                                    {questions.map((question, index) => (
                                        <Draggable key={index} draggableId={`question-${index}`} index={index}>
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
                                                            onChange={(e) => handleQuestionChange(index, e.target.value)}
                                                            style={{ flex: 1, marginBottom: "0.5rem", padding: "0.5rem" }}
                                                        />
                                                        <button onClick={() => handleDeleteQuestion(index)} style={{ marginLeft: "0.5rem" }}>Delete</button>
                                                    </div>
                                                    <select
                                                        value={question.ansType}
                                                        onChange={(e) => handleAnswerTypeChange(index, e.target.value)}
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
                                                                <button onClick={() => addOption(index)}>Add Option</button>
                                                            )}
                                                            {question.options.map((option, oIndex) => (
                                                                <div key={oIndex} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter option"
                                                                        value={option}
                                                                        onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
                                                                        style={{ flex: 1, marginBottom: "0.5rem", padding: "0.5rem" }}
                                                                    />
                                                                    <button onClick={() => removeOption(index, oIndex)} style={{ marginLeft: "0.5rem" }}>Remove</button>
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
            )}
        </div>
    );
}

export default NewForm;

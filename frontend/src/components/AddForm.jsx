import { useContext, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from 'axios';
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";


function AddForm() {
    const {user}=useContext(UserContext)
    const [sections, setSections] = useState([]);
    const [formTitle, setFormTitle] = useState("Untitled Form");
    const [formDescription, setFormDescription] = useState("Description");
    const navigate=useNavigate()

    const handleSectionChange = (index, field, value) => {
        const updatedSections = [...sections];
        updatedSections[index][field] = value;
        setSections(updatedSections);
    };

    const handleQuestionChange = (sectionIndex, questionIndex, value) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].questions[questionIndex].name = value;
        setSections(updatedSections);
    };

    const handleAnswerTypeChange = (sectionIndex, questionIndex, value) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].questions[questionIndex].ansType = value;
        setSections(updatedSections);
    };

    const addSection = () => {
        setSections([...sections, { title: "", description: "", questions: [] }]);
    };

    const removeSection = (index) => {
        const updatedSections = sections.filter((_, i) => i !== index);
        setSections(updatedSections);
    };

    const addQuestion = (sectionIndex) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].questions.push({ name: "", ansType: "text", options: [] });
        setSections(updatedSections);
    };

    const addOption = (sectionIndex, questionIndex) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].questions[questionIndex].options.push("");
        setSections(updatedSections);
    };

    const handleOptionChange = (sectionIndex, questionIndex, optionIndex, value) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].questions[questionIndex].options[optionIndex] = value;
        setSections(updatedSections);
    };

    const removeOption = (sectionIndex, questionIndex, optionIndex) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].questions[questionIndex].options.splice(optionIndex, 1);
        setSections(updatedSections);
    };

    const handleDeleteQuestion = (sectionIndex, questionIndex) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].questions.splice(questionIndex, 1);
        setSections(updatedSections);
    };

    const moveQuestion = (dragIndex, hoverIndex, sectionIndex) => {
        const updatedSections = [...sections];
        const [movedQuestion] = updatedSections[sectionIndex].questions.splice(dragIndex, 1);
        updatedSections[sectionIndex].questions.splice(hoverIndex, 0, movedQuestion);
        setSections(updatedSections);
    };

    // Save form data to backend
    const saveForm = async () => {
        try {
            const formData = {user:user ,title: formTitle, description: formDescription, sections:sections };
            const response=await axios.post('http://localhost:4000/newForm', formData); 
            if(response.status===200)
            {
                alert('Form saved successfully');
                navigate('/home')
            }
            else{
                alert('Unable to save form');
            }
           
        } catch (error) {
            console.error('Error saving form:', error);
            alert('Failed to save form');
        }
    };

    // Clear form
    const clearForm = () => {
        setFormTitle("Untitled Form");
        setFormDescription("Description");
        setSections([]);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={styles.container}>
                <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    style={styles.titles}
                    placeholder="Form Title"
                />
                <textarea
                    rows="3"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    style={styles.titles}
                    placeholder="Form Description"
                />

                {/* Save and Clear buttons */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    <button onClick={saveForm} style={styles.saveButton}>Save</button>
                    <button onClick={clearForm} style={styles.clearButton}>Clear</button>
                </div>

                {sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} style={styles.sectionContainer}>
                        <div style={styles.sectionTitleBox}>
                            <input
                                type="text"
                                placeholder="Section Title"
                                value={section.title}
                                onChange={(e) => handleSectionChange(sectionIndex, "title", e.target.value)}
                                style={styles.sectionTitles}
                            />
                            <button onClick={() => removeSection(sectionIndex)} style={styles.removeSectionButton}>
                                Remove
                            </button>
                        </div>
                        <textarea
                            rows="2"
                            placeholder="Section Description"
                            value={section.description}
                            onChange={(e) => handleSectionChange(sectionIndex, "description", e.target.value)}
                            style={styles.sectionDescription}
                        />

                        <ol style={{ padding: 0, margin: 0, listStyleType: "none", width: "100%" }}>
                            {section.questions.map((question, index) => (
                                <DraggableQuestion
                                    key={index}
                                    sectionIndex={sectionIndex}
                                    index={index}
                                    question={question}
                                    moveQuestion={moveQuestion}
                                    handleQuestionChange={handleQuestionChange}
                                    handleDeleteQuestion={handleDeleteQuestion}
                                    handleAnswerTypeChange={handleAnswerTypeChange}
                                    addOption={addOption}
                                    handleOptionChange={handleOptionChange}
                                    removeOption={removeOption}
                                />
                            ))}
                        </ol>

                        <button onClick={() => addQuestion(sectionIndex)} style={styles.addQuestionButton}>
                            Add Question
                        </button>
                    </div>
                ))}

                <button onClick={addSection} style={styles.addSectionButton}>
                    Add Section
                </button>
            </div>
        </DndProvider>
    );
}

function DraggableQuestion({
    sectionIndex,
    index,
    question,
    moveQuestion,
    handleQuestionChange,
    handleDeleteQuestion,
    handleAnswerTypeChange,
    addOption,
    handleOptionChange,
    removeOption,
}) {
    const [{ isDragging }, dragRef] = useDrag({
        type: "question",
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, dropRef] = useDrop({
        accept: "question",
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveQuestion(draggedItem.index, index, sectionIndex);
                draggedItem.index = index;
            }
        },
    });

    return (
        <li
            ref={(node) => dragRef(dropRef(node))}
            style={{
                ...styles.questionContainer,
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <input
                    type="text"
                    placeholder="Enter the question"
                    value={question.name}
                    onChange={(e) => handleQuestionChange(sectionIndex, index, e.target.value)}
                    style={{ flex: 1, marginBottom: "0.5rem", padding: "0.5rem" }}
                />
                <button onClick={() => handleDeleteQuestion(sectionIndex, index)} style={styles.deleteButton}>
                    Delete
                </button>
            </div>
            <select
                value={question.ansType}
                onChange={(e) => handleAnswerTypeChange(sectionIndex, index, e.target.value)}
                style={{ width: "max-content", marginBottom: "0.5rem", padding: "0.5rem" }}
            >
                <option value="single option">Single Option</option>
                <option value="multi options">Multi Options</option>
                <option value="numeric">Numeric</option>
                <option value="text">Text</option>
                <option value="date">Date</option> {/* Added Date option */}
            </select>

            {/* Render additional input fields based on answer type */}
            {question.ansType === "date" && (
                <input
                    type="date"
                    style={{ marginBottom: "0.5rem", padding: "0.5rem" }}
                />
            )}

            {["single option", "multi options"].includes(question.ansType) && (
                <>
                    {question.options.length < 4 && (
                        <button onClick={() => addOption(sectionIndex, index)} style={styles.addOptionButton}>
                            Add Option
                        </button>
                    )}
                    {question.options.map((option, oIndex) => (
                        <div key={oIndex} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                            <input
                                type="text"
                                placeholder="Enter option"
                                value={option}
                                onChange={(e) => handleOptionChange(sectionIndex, index, oIndex, e.target.value)}
                                style={{ flex: 1, marginBottom: "0.5rem", padding: "0.5rem" }}
                            />
                            <button onClick={() => removeOption(sectionIndex, index, oIndex)} style={styles.removeOptionButton}>
                                Remove
                            </button>
                        </div>
                    ))}
                </>
            )}
        </li>
    );
}


export default AddForm;

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "75%",
        margin: "auto",
        padding: "1rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    titles: {
        width: "50%",
        marginBottom: "0.5rem",
        padding: "0.5rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
    },
    sectionContainer: {
        display: "flex",
        flexDirection: "column",
        width: "75%",
        marginBottom: "1rem",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "white",
        alignItems: "center",
    },
    sectionTitleBox: {
        width: "75%",
        marginBottom: "0.5rem",
        backgroundColor: "white",
    },
    sectionTitles: {
        width: "75%",
        marginBottom: "0.5rem",
        padding: "0.5rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
    },
    sectionDescription: {
        width: "75%",
        marginBottom: "1rem",
        padding: "0.5rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
        resize: "vertical",
        backgroundColor:'white',
        color:'black'
    },
    addOptionButton: {
        marginTop: "0.5rem",
        marginBottom: "1rem",
        padding: "0.5rem 1rem",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    removeOptionButton: {
        marginLeft: "0.5rem",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "4px",
        padding: "0.5rem 0.75rem",
        cursor: "pointer",
    },
    addQuestionButton: {
        marginTop: "1rem",
        marginBottom: "1rem",
        padding: "0.5rem 1rem",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    addSectionButton: {
        marginTop: "1rem",
        padding: "0.5rem 1rem",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    deleteButton: {
        marginLeft: "0.5rem",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "4px",
        padding: "0.5rem 0.75rem",
        cursor: "pointer",
    },
    questionContainer: {
        padding: "0.5rem",
        marginBottom: "0.5rem",
        backgroundColor: "#f1f1f1",
        borderRadius: "4px",
    },
};

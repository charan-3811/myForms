import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function Home() {
    const { user } = useContext(UserContext);
    const [forms, setForms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await axios.get(`https://myformsbackend.onrender.com/forms/${user}`);
                if (response.status === 200) {
                    setForms(response.data);
                    console.log(response.data);
                }
            } catch (e) {
                console.error(e);
                alert("There was an error fetching the forms.");
            }
        };

        if (user && user !== "None") {
            fetchForms();
        }
    }, [user]);

    function handleEdit(id) {
        navigate(`/viewQuestions/${id}`);
    }

    async function handleDelete(id) {
        try {
            const response = await axios.delete(`https://myformsbackend.onrender.com/deleteForm/${id}`);
            if (response.status === 200) {
                setForms((prevForms) => prevForms.filter((form) => form._id !== id));
            }
        } catch (e) {
            alert("Failed to delete");
            console.error("Error deleting form:", e);
        }
    }

    function handleShare(id) {
        navigator.clipboard.writeText(`http:localhost:5173/form/${id}`).then(()=>{
            alert("Link copied to clipboard")
        })
    }

    return (
        <div style={{display:'flex',flexDirection:'column', padding: '2rem', textAlign: 'center' ,alignItems:'center'}}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem',color:'Black' }}>FORMS</h2>
            <Link to="/newForm">
                <button style={{
                    backgroundColor: 'teal',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    borderRadius: '0.25rem',
                }}>ADD</button>
            </Link>
            <div style={{ marginTop: '2rem' }}>
                {forms.length > 0 ? (
                    <ul style={{ padding: 0 ,maxWidth:'100%'}}>
                        {forms.map((form, index) => (
                            <li key={index} style={{
                                color:'black',
                                padding: '1rem',
                                margin: '0.5rem 0',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '0.25rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                {form.title}
                                <div>
                                    <button onClick={() => handleEdit(form._id)}>EDIT</button>
                                    <button  onClick={() => handleDelete(form._id)}>Delete</button>
                                    <button onClick={()=>handleShare(form._id)}>Share</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No forms available.</p>
                )}
            </div>
        </div>
    );
}

export default Home;

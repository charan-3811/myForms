import  { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function NavBar() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    function handleLogout() {
        setUser("None");
        sessionStorage.removeItem('user');
        navigate("/");
    }

    return (
        <div style={navBarStyle}>
            <Link to="/home" >
                <button>Home</button>
            </Link>
            {user === "None" ? (
                <Link to="/" >
                    <button>Login</button>
                </Link>
            ) : (
                <button onClick={handleLogout}>Logout</button>
            )}
        </div>
    );
}

const navBarStyle = {
    width: '100%',
    backgroundColor: 'darkslategrey',

    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    boxSizing: 'border-box',
};



export default NavBar;

import React, {useContext} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider} from './contexts/UserContext';
import Navbar from './components/NavBar.jsx';
import NewForm from "./components/NewForm.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import FormResponse from "./components/FormResponse.jsx";
import ViewForm from "./components/ViewForm.jsx";
import Responses from "./components/Responses.jsx";

const App = () => {

    return (
        <div style={{width:'100vw'}}>
        <UserProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path={"/home"} element={<Home />} />
                    <Route path={"/"} element={<Login />} />
                    <Route path={"/signup"} element={<Signup />} />
                    <Route path={"/newForm"} element={<NewForm />} />
                    <Route path={"/form/:id"} element={<FormResponse />} />
                    <Route path={"/viewQuestions/:id"} element={<ViewForm />} />
                    <Route path={"/viewResponses/:id"} element={<Responses />} />
                </Routes>
            </Router>
        </UserProvider>
        </div>
    );
}

export default App;

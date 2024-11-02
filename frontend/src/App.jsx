import  { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, UserContext } from './contexts/UserContext';
import Navbar from './components/NavBar.jsx';
//import NewForm from "./components/NewForm.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import FormResponse from "./components/FormResponse.jsx";
import ViewForm from "./components/ViewForm.jsx";
import Responses from "./components/Responses.jsx";
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import AddForm from './components/AddForm.jsx';

const App = () => {
    const { user } = useContext(UserContext); // Get user context

    return (
        <div style={{ width: '100vw' }}>
            <UserProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={ <Login />} />
                        <Route path="/signup" element={<Signup />} />

                        {/* Protected Routes */}
                        <Route
                            path="/home"
                            element={
                                <PrivateRoute>
                                    <Home />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/newForm"
                            element={
                                <PrivateRoute>
                                    <AddForm />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/form/:id"
                            element={
                                <PrivateRoute>
                                    <FormResponse />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/viewQuestions/:id"
                            element={
                                <PrivateRoute>
                                    <ViewForm />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/viewResponses/:id"
                            element={
                                <PrivateRoute>
                                    <Responses />
                                </PrivateRoute>
                            }
                        />

                        {/* Redirect unknown routes to home or login */}
                        <Route
                            path="*"
                            element={
                                user ? <Navigate to="/home" /> : <Navigate to="/" />
                            }
                        />
                    </Routes>
                </Router>
            </UserProvider>
        </div>
    );
};

export default App;

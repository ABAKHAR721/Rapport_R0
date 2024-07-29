import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, useNavigate, Navigate } from 'react-router-dom';
import Ajouter_R0 from './Rapport_R0/Add_Rapport_R0';
import List_R0 from './Rapport_R0/List_Rapport_R0';
import NaveBare from './Partials/NaveBare';
import Login from './Auth/login';
import ADD_USER_Form from './Users/Add_new_user';
import RequireAuth from './Auth/RequireAuth';
import UserList from './Users/UserList';
import Footer from './Partials/Footer';
import NotFound from './Auth/NotFound'; // Import the NotFound component

const App = () => {
    const { id } = useParams();
    const [Token, setToken] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const savedLoggedIn = localStorage.getItem('isLoggedIn');
        return savedLoggedIn ? JSON.parse(savedLoggedIn) : false;
    });

    const [role, setRole] = useState(() => {
        const savedRole = localStorage.getItem('role');
        return savedRole ? savedRole : null;
    });

    const [ID, setID] = useState(() => {
        const savedID = localStorage.getItem('ID');
        return savedID ? parseInt(savedID) : null;
    });

    const handleLoginStatus = (islogged, role) => {
        setIsLoggedIn(islogged);
        setRole(role);
    };

    const getid = (id) => {
        setID(parseInt(id));
    };

    const gettoken = (token) => {
        setToken(token);
    };

    const handleLogout = (navigate) => {
        setIsLoggedIn(false);
        setRole(null);
        setID(null);
        setToken("");
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('ID');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    useEffect(() => {
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
        localStorage.setItem('role', role);
        localStorage.setItem('ID', JSON.stringify(ID));
    }, [isLoggedIn, role, ID]);

    return (
        <div style={{ backgroundColor: 'black', color: 'white' }}>
            <Router>
                <AppContent 
                    isLoggedIn={isLoggedIn} 
                    role={role} 
                    handleLogout={handleLogout} 
                    handleLoginStatus={handleLoginStatus}
                    gettoken={gettoken}
                    getid={getid}
                />
                <Footer/>
            </Router>
        </div>
    );
};

const AppContent = ({ isLoggedIn, role, handleLogout, handleLoginStatus, gettoken, getid }) => {
    const navigate = useNavigate();

    return (
        <>
            <NaveBare isLoggedIn={isLoggedIn} role={role} handleLogout={() => handleLogout(navigate)} />
            <Routes>
                <Route path="/login" element={<Login isLoggedIn={isLoggedIn} handleLoginStatus={handleLoginStatus} gettoken={gettoken} getid={getid} />} />
                {isLoggedIn && role === 'User' && (
                    <>
                        <Route path="/list" element={<RequireAuth isLoggedIn={isLoggedIn}><List_R0 /></RequireAuth>} />
                    </>
                )}
                {isLoggedIn && role === 'Employer' && (
                    <>
                        <Route path="/list" element={<RequireAuth isLoggedIn={isLoggedIn}><List_R0 /></RequireAuth>} />
                        <Route path="/ajouter" element={<RequireAuth isLoggedIn={isLoggedIn}><Ajouter_R0 /></RequireAuth>} />
                    </>
                )}
                {isLoggedIn && role === 'Admin' && (
                    <>
                        <Route path="/list" element={<RequireAuth isLoggedIn={isLoggedIn}><List_R0 role={role} /></RequireAuth>} />
                        <Route path="/UserList" element={<RequireAuth isLoggedIn={isLoggedIn}><UserList /></RequireAuth>} />
                        <Route path="/ajouter" element={<RequireAuth isLoggedIn={isLoggedIn}><Ajouter_R0 /></RequireAuth>} />
                        <Route path="/NewUser" element={<RequireAuth isLoggedIn={isLoggedIn}><ADD_USER_Form /></RequireAuth>} />
                    </>
                )}

                <Route path="/" element={<Navigate to="/login" />} /> 
                <Route path="*" element={<NotFound />} /> 

            </Routes>
           
            
            
        </>
        
    );
};

export default App;

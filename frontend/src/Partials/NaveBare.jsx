import React from 'react';
import { Link } from 'react-router-dom';
import {Dropdown} from 'react-bootstrap';

const NaveBare = ({ isLoggedIn, role, handleLogout }) => {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link className="navbar-brand">OCP</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNav">
                    <ul className="navbar-nav">
                        {!isLoggedIn && (
                            <li className="nav-item active">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                        )}
                        {isLoggedIn && (
                            <>
                                {(role === 'Employer' || role === 'Admin') && (
                                    <li className="nav-item active">
                                        <Link className="nav-link" to="/ajouter">Add</Link>
                                    </li>
                                )}
                                <li className="nav-item active">
                                    <Link className="nav-link" to="/list">List</Link>
                                </li>
                                
                                {role === 'Admin' && (
                                    <Dropdown as="li" className="nav-item">
                                        <Dropdown.Toggle as={Link} to="#" className="nav-link dropdown-toggle">
                                            User
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item as={Link} to="/NewUser">New User</Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/UserList">User List</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                            </>
                        )}
                    </ul>
                    {isLoggedIn && (
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <button className="btn btn-warning mx-4" onClick={handleLogout} style={{ color: 'white', textDecoration: 'none' }}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default NaveBare;

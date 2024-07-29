import React, { useState } from 'react';
import axios from 'axios';
import './style/style.css'; // Import custom CSS for styling

const ADD_USER_Form = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role,setrole]=useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('role',role);
            await axios.post('http://127.0.0.1:8000/api/register', formData);
            alert(`You're added the ${name} successfully`);
            setEmail('');
            setName('');
            setPassword('');
            setrole('');
        } catch (error) {
            console.error(error);
            alert('An error occurred during registration');
        }
    };
    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="custom-register-form">
                <div className="custom-form-group">
                    <label htmlFor="name" className="custom-form-label">Nom</label>
                    <input type="text" className="custom-form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="custom-form-group">
                    <label htmlFor="role" className="custom-form-label">Role</label>
                    <select className="custom-form-control" id="role" value={role} onChange={(e) => setrole(e.target.value)} required>
                        <option value=""></option>
                        <option value="Admin">Admin</option>
                        <option value="Employer">Employer</option>
                        <option value="User">User</option>
                    </select>
                </div>
                <div className="custom-form-group">
                    <label htmlFor="email" className="custom-form-label">Email</label>
                    <input type="email" className="custom-form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="custom-form-group">
                    <label htmlFor="password" className="custom-form-label">Mot de passe</label>
                    <input type="password" className="custom-form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="custom-btn custom-btn-primary">ADD</button>
            </form>
        </div>
    );
};
export default ADD_USER_Form;

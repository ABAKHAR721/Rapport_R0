import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers(currentPage, perPage);
    }, [currentPage, perPage]);

    const fetchUsers = async (page, perPage) => {
        try {
            const response = await axios.get('http://localhost:8000/api/users', {
                params: { page, per_page: perPage },
            });
            setUsers(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handlePerPageChange = (e) => {
        setPerPage(e.target.value);
    };

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh" }}>
            <h1 className="my-4">User List</h1>
            <div className="mb-3">
                <label htmlFor="perPage" className="form-label">Users per page:</label>
                <select id="perPage" className="form-select" value={perPage} onChange={handlePerPageChange}>
                    <option value={2}>2</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </select>
            </div>
            <table className="table table-striped table-dark">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-center">
                <nav>
                    <ul className="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li
                                key={index + 1}
                                className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default UserList;

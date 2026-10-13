import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");

    async function loadUsers() 
    {
        try 
        {
            const response = await API.get("/users");
            setUsers(response.data);
        } 
        catch 
        {
            setMessage("Unable to load users. Check your admin login.");
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    async function deleteUser(id) {
        if (!window.confirm("Delete this user?")) {
            return;
        }

        try 
        {
            await API.delete(`/users/${id}`);
            setMessage("User deleted");
            loadUsers();
        } 
        catch (error) 
        {
            setMessage(error.response?.data?.message || "Unable to delete user");
        }
    }

    return (
        <main className="container">
            <h2>Manage Users</h2>
            <p>{message}</p>

            {users.map((user) => (
                <article className="admin-item" key={user._id}>
                    <div>
                        <b>{user.name}</b>
                        <p>{user.email}</p>
                        <small>Role: {user.role}</small>
                    </div>

                    <button disabled={user.role === "admin"} onClick={() => deleteUser(user._id)}>
                        Delete
                    </button>
                </article>
            ))}
        </main>
    );
}

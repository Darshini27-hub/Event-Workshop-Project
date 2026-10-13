import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try 
        {
            const response = await API.post("/auth/register", {
                name, email, password
            });

            setMessage(response.data.message);
            navigate("/login");
        } 
        catch (error) 
        {
            setMessage(error.response?.data?.message || "Registration failed");
        }
    }

    return (
        <main className="form-container">
            <h2>Create Account</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password (minimum 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                />

                <button type="submit">Register</button>
            </form>

            <p>{message}</p>
        </main>
    );
}

import { useEffect, useState } from "react";
import API from "../services/api";

export default function MyRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [message, setMessage] = useState("");

    async function loadRegistrations() {
        try {
            const response = await API.get("/registrations/my");

            setRegistrations(
                response.data.filter((item) => item.status === "registered")
            );
        } catch {
            setMessage("Unable to load registrations");
        }
    }

    useEffect(() => {
        loadRegistrations();
    }, []);

    async function cancelRegistration(id) {
        try 
        {
            const response = await API.delete(`/registrations/${id}`);

            setMessage(response.data.message);
            loadRegistrations();
        } 
        catch (error) 
        {
            setMessage(error.response?.data?.message || "Cancellation failed");
        }
    }

    return (
        <main className="container">
            <h2>My Registrations</h2>
            <p>{message}</p>

            {registrations.map((item) => (
                <article className="event-card" key={item._id}>
                    <h3>{item.event?.title || "Event unavailable"}</h3>
                    <p>
                        Date: {item.event ? new Date(item.event.eventDate).toLocaleString() : "Unavailable"}
                    </p>

                    <button onClick={() => cancelRegistration(item._id)}>
                        Cancel Registration
                    </button>
                </article>
            ))}
        </main>
    );
}

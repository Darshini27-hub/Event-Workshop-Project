import { useEffect, useState } from "react";
import API from "../services/api";

export default function Events() {
    const [events, setEvents] = useState([]);
    const [message, setMessage] = useState("");

    async function loadEvents() {
        try 
        {
            const response = await API.get("/events");
            setEvents(response.data);
        } 
        catch 
        {
            setMessage("Unable to load events");
        }
    }

    useEffect(() => {
        loadEvents();
    }, []);

    async function registerEvent(eventId) {
        if (!localStorage.getItem("token")) {
            setMessage("Please login first");
            return;
        }

        try {
            const response = await API.post("/registrations", {
                eventId
            });

            setMessage(response.data.message);
            loadEvents();
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Registration failed"
            );
        }
    }

    return (
        <main className="container">
            <h2>Available Events</h2>
            <p>{message}</p>

            <div className="events">
                {events.map((event) => (
                    <article className="event-card" key={event._id}>
                        <h3>{event.title}</h3>
                        <p>{event.description}</p>
                        <p>
                            Category: {event.category?.name || "Unknown"}
                        </p>
                        <p>
                            Date: {new Date(event.eventDate).toLocaleString()}
                        </p>
                        <p>Location: {event.location}</p>
                        <p>Available seats: {event.availableSeats}</p>

                        <button disabled={event.availableSeats < 1} onClick={() => registerEvent(event._id)}>
                            Register
                        </button>
                    </article>
                ))}
            </div>
        </main>
    );
}

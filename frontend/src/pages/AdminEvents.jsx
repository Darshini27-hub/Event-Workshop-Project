import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState("");

    async function loadData() {
        try 
        {
            const [eventResponse, categoryResponse] = await Promise.all([
                API.get("/events"),
                API.get("/categories")
            ]);

            setEvents(eventResponse.data);
            setCategories(categoryResponse.data);
        } 
        catch 
        {
            setMessage("Unable to load data");
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    async function addEvent(e) {
        e.preventDefault();

        try {
            await API.post("/events", {
                title,
                description,
                category,
                eventDate: new Date(eventDate).toISOString(),
                location,
                capacity: Number(capacity)
            });

            setMessage("Event added successfully");
            setTitle("");
            setDescription("");
            setCategory("");
            setEventDate("");
            setLocation("");
            setCapacity("");

            loadData();
        } 
        catch (error) 
        {
            setMessage (error.response?.data?.message || "Unable to add event");
        }
    }

    async function deleteEvent(id) {
        try 
        {
            await API.delete(`/events/${id}`);
            setMessage("Event deleted");
            loadData();
        } 
        catch (error) 
        {
            setMessage(error.response?.data?.message || "Unable to delete event");
        }
    }

    return (
        <main className="container">
            <h2>Manage Events</h2>
            <p>{message}</p>

            <form onSubmit={addEvent}>
                <input
                    placeholder="Event title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="">Select category</option>
                    {categories.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.name}
                        </option>
                    ))}
                </select>

            
                <label>Event date and time</label>
                <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                />

                <input
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />

                <input
                    type="number"
                    min="1"
                    placeholder="Capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                />

                <button type="submit">Add Event</button>
            </form>

            <h3>Existing Events</h3>

            {events.map((event) => (
                <article className="admin-item" key={event._id}>
                    <span>{event.title}</span>
                    <button onClick={() => deleteEvent(event._id)}>
                        Delete
                    </button>
                </article>
            ))}
        </main>
    );
}

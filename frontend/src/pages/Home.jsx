import { Link } from "react-router-dom";

export default function Home() {
    return (
        <main className="container">
            <h1>Event & Workshop Management</h1>
            <p>Discover events, workshops and learning opportunities.</p>
            <Link to="/events">
                <button>View Events</button>
            </Link>
        </main>
    );
}

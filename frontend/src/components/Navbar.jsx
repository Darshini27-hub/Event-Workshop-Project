import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    function logout() 
    {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
        navigate("/login");
        window.location.reload();
    }

    return (
        <nav className="navbar">
            <h2>Event Management</h2>

            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/events">Events</Link>

                {token && (
                    <Link to="/my-registrations">My Registrations</Link>
                )}

                {role === "admin" && (
                    <>
                        <Link to="/admin/events">Manage Events</Link>
                        <Link to="/admin/categories">Categories</Link>
                        <Link to="/admin/users">Users</Link>
                    </>
                )}

                {!token ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <button onClick={logout}>Logout</button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;

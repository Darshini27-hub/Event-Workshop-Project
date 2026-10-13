import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import MyRegistrations from "./pages/MyRegistrations";
import AdminEvents from "./pages/AdminEvents";
import AdminCategories from "./pages/AdminCategories";
import AdminUsers from "./pages/AdminUsers";

import "./App.css";

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/events" element={<Events />} />
                <Route path="/my-registrations" element={<MyRegistrations />} />
                <Route path="/admin/events" element={<AdminEvents />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/users" element={<AdminUsers />} />
            </Routes>
        </BrowserRouter>
    );
}

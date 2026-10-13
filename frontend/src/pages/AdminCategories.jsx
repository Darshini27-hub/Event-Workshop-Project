import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    async function loadCategories() {
        try 
        {
            const response = await API.get("/categories");
            setCategories(response.data);
        } 
        catch 
        {
            setMessage("Unable to load categories");
        }
    }

    useEffect(() => {
        loadCategories();
    }, []);

    async function addCategory(e) {
        e.preventDefault();

        try 
        {
            await API.post("/categories", { name, description });
            setName("");
            setDescription("");
            setMessage("Category added");
            loadCategories();
        } 
        catch (error) 
        {
            setMessage(error.response?.data?.message || "Unable to add category");
        }
    }

    async function deleteCategory(id) {
        try 
        {
            await API.delete(`/categories/${id}`);
            setMessage("Category deleted");
            loadCategories();
        } 
        catch (error) 
        {
            setMessage(error.response?.data?.message || "Unable to delete category" );
        }
    }

    return (
        <main className="container">
            <h2>Manage Categories</h2>
            <p>{message}</p>

            <form onSubmit={addCategory}>
                <input
                    placeholder="Category name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit">Add Category</button>
            </form>

            {categories.map((category) => (
                <article className="admin-item" key={category._id}>
                    <span>{category.name}</span>
                    <button onClick={() => deleteCategory(category._id)}>
                        Delete
                    </button>
                </article>
            ))}
        </main>
    );
}

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [contacts, setContacts] = useState([]);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/users");
            setContacts(response.data);
        } catch (error) {
            console.error("Error al obtener contactos:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newContact = { name, phone };

        try {
            await axios.post("http://127.0.0.1:8000/users/insert", newContact);
            setName("");
            setPhone("");
            fetchContacts();
        } catch (error) {
            console.error("Error al agregar contacto:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/users/delete/${id}`);
            fetchContacts();
        } catch (error) {
            console.error("Error al eliminar contacto:", error);
        }
    };

    const handleEdit = (contact) => {
        setEditingId(contact.id);
        setName(contact.name);
        setPhone(contact.phone);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updatedContact = { name, phone };

        try {
            await axios.put(`http://127.0.0.1:8000/users/update/${editingId}`, updatedContact);
            setEditingId(null);
            setName("");
            setPhone("");
            fetchContacts();
        } catch (error) {
            console.error("Error al actualizar contacto:", error);
        }
    };

    return (
        <div className="container">
            <h1>Gestión de Contactos</h1>

            <form onSubmit={editingId ? handleUpdate : handleSubmit} className="form">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre"
                    required
                />
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Teléfono"
                    required
                />
                <button type="submit" className="btn save">{editingId ? "Actualizar" : "Agregar"}</button>
                {editingId && <button onClick={() => setEditingId(null)} className="btn cancel">Cancelar</button>}
            </form>

            <ul className="contact-list">
                {contacts.map((contact) => (
                    <li key={contact.id} className="contact-item">
                        <span>{contact.name} - {contact.phone}</span>
                        <div>
                            <button onClick={() => handleEdit(contact)} className="btn edit">Editar</button>
                            <button onClick={() => handleDelete(contact.id)} className="btn delete">Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
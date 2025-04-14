// src/pages/UpdateBook.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../utils/AuthConext";
import "./updateBook.css";

export default function UpdateBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role,token } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    nbrPage: 1,
    genre: "",
    description: "",
    publicationDate: "",
  });
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(
          `https://backend-projet-7mvc.onrender.com/api/v1/book/${id}`
        );
        const { title, author, nbrPage, genre, description, publicationDate } =
          res.data;
        setFormData({
          title,
          author,
          nbrPage,
          genre: genre.join(", "),
          description,
          publicationDate: publicationDate?.substring(0, 10) || "",
        });
      } catch (error) {
        console.error("Erreur de chargement :", error);
      }
    };
    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append("coverImage", coverImage);

    try {
      await axios.put(`https://backend-projet-7mvc.onrender.com/api/v1/book/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Livre modifié avec succès !");
      navigate(`/book/${id}`);
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
    }
  };
  if (role !== "admin") {
    return <p>⛔ Accès refusé. Réservé aux administrateurs.</p>;
  }

  return (
    <div className="update-book-container">
      <h2>Modifier le livre</h2>
      <form onSubmit={handleSubmit} className="update-book-form">
        <label>Titre</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Auteur</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />

        <label>Nombre de pages</label>
        <input
          type="number"
          name="nbrPage"
          value={formData.nbrPage}
          onChange={handleChange}
          min="1"
          max="10000"
          required
        />

        <label>Genres (séparés par des virgules)</label>
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <label>Date de publication</label>
        <input
          type="date"
          name="publicationDate"
          value={formData.publicationDate}
          onChange={handleChange}
        />

        <label>Image de couverture</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <button type="submit">Enregistrer les modifications</button>
      </form>
    </div>
  );
}

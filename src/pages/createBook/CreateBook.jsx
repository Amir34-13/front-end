import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthConext";
import "./createBook.css";

export default function CreateBook() {
  const { role, token } = useAuth();
  const navigate = useNavigate();
    const [coverImage, setCoverImage] = useState(null);
const handleImageChange = (e) => {
  setCoverImage(e.target.files[0]);
};

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    nbrPage: 1,
    genre: "",
    description: "",
    publicationDate: "",
  });

  const [error, setError] = useState(null);

  if (role !== "admin") {
    return <p>⛔ Accès refusé. Réservé aux administrateurs.</p>;
  }

   const handleChange = (e) => {
     const { name, value } = e.target;
     setFormData((prev) => ({
       ...prev,
       [name]: value,
     }));
   };



  const handleSubmit = async (e) => {
    e.preventDefault();
     const data = new FormData();
     Object.entries(formData).forEach(([key, value]) =>
       data.append(key, value)
     );
     data.append("coverImage", coverImage);

     console.log(data)
    try {
      
      await axios.post(
        "https://backend-projet-7mvc.onrender.com/api/v1/book",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création du livre.");
    }
  };

  return (
    <div className="create-book-container">
      <h2>📚 Ajouter un nouveau livre</h2>
      <form onSubmit={handleSubmit} className="create-book-form">
        <input
          type="text"
          name="title"
          placeholder="Titre"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Auteur"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="publicationDate"
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="coverImage"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        <button type="submit">Créer le livre</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

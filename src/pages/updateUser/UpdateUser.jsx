// UpdateUser.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../utils/AuthConext";
import "./updateUser.css";

const UpdateUser = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    profilePicture: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://backend-projet-7mvc.onrender.com/api/v1/user/${id}`).then((res) => {
      const { username, email, bio } = res.data;
      setFormData({ ...formData, username, email, bio });
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      setFormData({ ...formData, profilePicture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    const form = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    }

    try {
      await axios.put(`https://backend-projet-7mvc.onrender.com/api/v1/user/${id}`, form, config);
      alert("Mise à jour réussie !");
      navigate(`/user/${id}`);
    } catch (err) {
      alert("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div className="update-user">
      <h2>Modifier le profil</h2>
      <form onSubmit={handleSubmit}>
        <label>Nom d'utilisateur</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
        ></textarea>

        <label>Photo de profil</label>
        <input type="file" name="profilePicture" onChange={handleChange} />

        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
};

export default UpdateUser;

// src/pages/SearchPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home.css"; // réutilise le style de la home
import { useNavigate } from "react-router-dom";

const API_URL = "https://backend-projet-7mvc.onrender.com/api/v1/book";

function SearchPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("averageRating");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("keyword", search);
        params.append(
          "sort",
          sort === "averageRating" ? "-averageRating" : "title"
        );

        const res = await axios.get(`${API_URL}?${params.toString()}`);
        setBooks(res.data.data || []);
      } catch (err) {
        console.error("Erreur de chargement des livres :", err);
      }
      setLoading(false);
    };

    fetchBooks();
  }, [search, sort]);

  return (
    <div className="home-container">
      <h2>Recherche de Livres</h2>

      <div className="search-controls" style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Rechercher un livre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px" }}
        >
          <option value="averageRating">Trier par note</option>
          <option value="title">Trier par titre</option>
        </select>
      </div>

      {loading ? (
        <p>Chargement des livres...</p>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div
              key={book._id}
              className="book-card"
              onClick={() => navigate(`/book/${book._id}`)}
            >
              <img
                src={book.coverImage}
                alt={book.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder.jpg"; // image de repli si ça échoue
                }}
              />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <p>⭐ {book.averageRating.toFixed(1)} / 5</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;

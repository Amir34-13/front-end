import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../utils/AuthConext";
import axios from "axios";
import "./bookDetails.css";
//img
export default function BookDetail() {
    const navigate = useNavigate();

  const { id } = useParams();
  const { token, userId, role } = useAuth(); // Récupérer le rôle de l'utilisateur
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReplies, setShowReplies] = useState({});
  const [userReview, setUserReview] = useState(null);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [editingReview, setEditingReview] = useState(false);
  const [responseText, setResponseText] = useState({});
  const [pagesRead, setPagesRead] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [responseLoading, setResponseLoading] = useState({});

  const fetchBook = async () => {
    try {
      const response = await axios.get(
        `https://backend-projet-7mvc.onrender.com/api/v1/book/${id}`
      );
      const data = response.data;
      setBook(data);

      const foundReview = data.reviews.find(
        (review) => review.user._id === userId
      );
      setUserReview(foundReview);

      if (foundReview) {
        setNewReview(foundReview.comment);
        setNewRating(foundReview.rating);
        setEditingReview(true);
      } else {
        setNewReview("");
        setNewRating(5);
        setEditingReview(false);
      }

      setLoading(false);
    } catch {
      setError("Livre non trouvé");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
    console.log(userId);
  }, [id, userId]);

  const toggleReplies = (reviewId) => {
    setShowReplies((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const handleReviewSubmit = async () => {
    if (reviewLoading) return;
    setReviewLoading(true);
    try {
      if (editingReview) {
        await axios.put(
          `https://backend-projet-7mvc.onrender.com/api/v1/review/${userReview._id}`,
          { comment: newReview, rating: newRating },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `https://backend-projet-7mvc.onrender.com/api/v1/review`,
          { bookId: id, comment: newReview, rating: newRating },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      await fetchBook();
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'avis :", error);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await axios.delete(
        `https://backend-projet-7mvc.onrender.com/api/v1/review/${userReview._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchBook();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'avis :", error);
    }
  };

  const handleResponseSubmit = async (reviewId) => {
    if (responseLoading[reviewId]) return;

    setResponseLoading((prev) => ({ ...prev, [reviewId]: true }));
    try {
      await axios.post(
        `https://backend-projet-7mvc.onrender.com/api/v1/response`,
        { reviewId, comment: responseText[reviewId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResponseText({ ...responseText, [reviewId]: "" });
      await fetchBook();
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réponse :", error);
    } finally {
      setResponseLoading((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleDeleteResponse = async (responseId, reviewId) => {
    try {
      await axios.delete(`https://backend-projet-7mvc.onrender.com/api/v1/response/`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { reviewId, responseId },
      });
      await fetchBook();
    } catch (error) {
      console.error("Erreur lors de la suppression de la réponse :", error);
    }
  };

  const toggleBookStatus = async (type) => {
    if (!token) return alert("Connectez-vous d'abord !");
    try {
      await axios.put(
        `https://backend-projet-7mvc.onrender.com/api/v1/book/addOrDelete${type}`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`${type} mis à jour avec succès`);
    } catch (err) {
      alert(`Erreur lors de la mise à jour de ${type}`);
    }
  };

  const handleDeleteBook = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
      try {
        await axios.delete(`https://backend-projet-7mvc.onrender.com/api/v1/book/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Livre supprimé avec succès");
        window.location.href = "/"; // Rediriger vers la page d'accueil après suppression
      } catch (error) {
        console.error("Erreur lors de la suppression du livre :", error);
      }
    }
  };
  const handleUpdateBook = async ()=>{
    navigate(`/modifier/${id}`);
  }

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="book-detail-container">
      <div className="book-info">
        <img src={book.coverImage} alt={book.title} className="book-cover" />
        <div className="book-details">
          <h2>{book.title}</h2>
          <p>
            <strong>Auteur:</strong> {book.author}
          </p>
          <p>
            <strong>Pages:</strong> {book.nbrPage}
          </p>
          <p>
            <strong>Genres:</strong> {book.genre.join(", ")}
          </p>
          <p>
            <strong>Date de publication:</strong> {book.publicationDate}
          </p>
          <p>
            <strong>Note moyenne:</strong> ⭐ {book.averageRating} / 5
          </p>
          <p className="description">
            <strong>Description:</strong> {book.description}
          </p>

          {token && (
            <div className="status-buttons">
              <button onClick={() => toggleBookStatus("Favorite")}>
                ❤️ Favori
              </button>
              <button onClick={() => toggleBookStatus("lu")}>📘 Lu</button>
              <button onClick={() => toggleBookStatus("EnCours")}>
                📖 En cours
              </button>
            </div>
          )}

          {role === "admin" && (
            <div className="admin-buttons">
              <button
                onClick={handleDeleteBook}
                style={{ backgroundColor: "red", color: "white" }}
              >
                Supprimer ce livre
              </button>
              <button
                onClick={handleUpdateBook}
                style={{ backgroundColor: "bleu", color: "white" }}
              >
                modufier ce livre
              </button>
            </div>
          )}
        </div>
      </div>

      {token && (
        <div className="add-review">
          <h3>{editingReview ? "Modifier votre avis" : "Ajouter un avis"}</h3>
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Votre avis..."
          />
          <div className="review-controls">
            <select
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((rate) => (
                <option key={rate} value={rate}>
                  ⭐ {rate}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              max={book.nbrPage}
              value={pagesRead}
              onChange={(e) => setPagesRead(e.target.value)}
              placeholder="Pages lues"
            />
          </div>
          <button onClick={handleReviewSubmit} disabled={reviewLoading}>
            {reviewLoading ? "Chargement..." : "Publier"}
          </button>
          {editingReview && (
            <button className="delete-btn" onClick={handleDeleteReview}>
              Supprimer
            </button>
          )}
        </div>
      )}

      <div className="reviews-section">
        <h3>Avis des lecteurs</h3>
        {book.reviews.length === 0 ? (
          <p>Aucun avis pour ce livre.</p>
        ) : (
          book.reviews.map((review) => (
            <div key={review._id} className="review-card">
              <p>
                <strong>
                  <Link
                    to={`/user/${review.user._id}`}
                    className="username-link"
                  >
                    {review.user.username}
                  </Link>
                </strong>
                : {review.comment}
              </p>
              <p>⭐ {review.rating}</p>

              {review.replies?.length > 0 && (
                <>
                  <button onClick={() => toggleReplies(review._id)}>
                    {showReplies[review._id]
                      ? "Masquer les réponses"
                      : "Voir les réponses"}
                  </button>
                  {showReplies[review._id] && (
                    <div className="review-replies">
                      {review.replies.map((reply) => (
                        <div key={reply._id}>
                          <p>
                            <strong>
                              <Link
                                to={`/user/${reply.user._id}`}
                                className="username-link"
                              >
                                {reply.user.username}
                              </Link>
                            </strong>
                            : {reply.comment}
                          </p>
                          {token && reply.user._id === userId && (
                            <button
                              onClick={() =>
                                handleDeleteResponse(reply._id, review._id)
                              }
                            >
                              Supprimer
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {token && (
                <div className="reply-form">
                  <textarea
                    placeholder="Répondre..."
                    value={responseText[review._id] || ""}
                    onChange={(e) =>
                      setResponseText({
                        ...responseText,
                        [review._id]: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() => handleResponseSubmit(review._id)}
                    disabled={responseLoading[review._id]}
                  >
                    {responseLoading[review._id] ? "Chargement..." : "Répondre"}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

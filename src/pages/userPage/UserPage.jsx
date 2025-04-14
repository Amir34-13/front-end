// UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../utils/AuthConext";
import "./userPage.css";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId, token, role,logOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isMe, setIsMe] = useState(false);
  const [isFollower, setIsFollower] = useState(false);
  const [loading, setLoading] = useState(true);

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://backend-projet-7mvc.onrender.com/api/v1/user/${id}`, { headers })
      .then((res) => {
        setProfile(res.data);
        setIsMe(userId === id);
        setIsFollower(res.data.followers?.includes(userId));
        console.log(res.data)
      })
      .finally(() => setLoading(false));
  }, [id, userId, token]);

  const updateFollowersLocally = (newFollowers) => {
    setProfile((prev) => ({
      ...prev,
      followers: newFollowers,
    }));
    setIsFollower(newFollowers.includes(userId));
  };

  const handleFollow = async () => {
    await axios.put(
      `https://backend-projet-7mvc.onrender.com/api/v1/user/follow/${id}`,
      {},
      { headers }
    );
    updateFollowersLocally([...profile.followers, userId]);
  };

  const handleUnfollow = async () => {
    await axios.put(
      `https://backend-projet-7mvc.onrender.com/api/v1/user/unfollow/${id}`,
      {},
      { headers }
    );
    updateFollowersLocally(profile.followers.filter((f) => f !== userId));
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce compte ?")) {
      try {
        await axios.delete(`https://backend-projet-7mvc.onrender.com/api/v1/user/${id}`, {
          headers,
        });
        alert("Compte supprimé avec succès.");
        logOut();
        navigate("/");
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const handleRemoveBook = async (bookId, section) => {
    await axios.put(
      `https://backend-projet-7mvc.onrender.com/api/v1/book/addOrDelete${section}`,
      { id: bookId },
      { headers }
    );
    setProfile((prev) => {
      let updatedSection = [...(prev[section] || [])];
      if (section === "enCours") {
        updatedSection = updatedSection.filter((e) => e.book._id !== bookId);
      } else {
        updatedSection = updatedSection.filter((book) => book._id !== bookId);
      }
      return {
        ...prev,
        [section]: updatedSection,
      };
    });
  };

  if (loading) return <p>Chargement...</p>;
  if (!profile) return <p>Profil introuvable</p>;

  const followersCount =
    profile.followers?.length || profile.followersCount || 0;
  const followingCount =
    profile.following?.length || profile.followingCount || 0;

  return (
    <div className="user-profile">
      <div className="header">
        <img
          src={
            profile.profilePicture
              ? profile.profilePicture
              : "profil_vide.jpg"
          }
          alt="Profil"
          className="profile-pic"
        />

        <div className="user-info">
          <h2>{profile.username}</h2>
          <p>{profile.bio}</p>
          <div className="counts">
            <span>{followersCount} abonnés</span>
            <span>{followingCount} abonnements</span>
          </div>

          {(isMe || role === "admin") && (
            <div className="actions">
              <button onClick={() => navigate(`/modifier-prf/${id}`)}>
                ✏️ Modifier
              </button>
              <button onClick={handleDeleteAccount} className="danger">
                🗑 Supprimer
              </button>
            </div>
          )}

          {userId &&
            !isMe &&
            role !== "admin" &&
            (isFollower ? (
              <button onClick={handleUnfollow}>Se désabonner</button>
            ) : (
              <button onClick={handleFollow}>S’abonner</button>
            ))}
        </div>
      </div>

      {(isMe || isFollower || role === "admin") && (
        <div className="books-section">
          <BookSection
            title="📘 Livres lus"
            books={profile.lus}
            section="lu"
            canRemove={isMe}
            onRemove={handleRemoveBook}
          />
          <BookSection
            title="💖 Favoris"
            books={profile.favorite}
            section="favorite"
            canRemove={isMe}
            onRemove={handleRemoveBook}
          />
          <BookSection
            title="📖 En cours"
            books={profile.enCours?.map((e) => e.book)}
            section="enCours"
            canRemove={isMe}
            onRemove={handleRemoveBook}
          />
        </div>
      )}
    </div>
  );
};

const BookSection = ({ title, books, section, canRemove, onRemove }) => (
  <div className="book-section">
    <h3>{title}</h3>
    <div className="book-list">
      {books && books.length > 0 ? (
        books.map((book) =>
          book ? (
            <div key={book._id} className="book-card">
              <img src={book.coverImage} alt={book.title} />
              <p>{book.title}</p>
              {canRemove && (
                <button onClick={() => onRemove(book._id, section)}>
                  ❌ Supprimer
                </button>
              )}
            </div>
          ) : null
        )
      ) : (
        <p>Aucun livre</p>
      )}
    </div>
  </div>
);

export default UserProfile;

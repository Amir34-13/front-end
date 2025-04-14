import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = ({ email }) => {
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      await axios.put("https://backend-projet-7mvc.onrender.com/api/v1/auth/resetPassword", {
        email,
        newPassword,
      });
      alert("Mot de passe mis à jour !");
      navigate("/auth");
    } catch (err) {
      alert("Erreur : " + err.response?.data.message || "Échec.");
    }
  };

  return (
    <div className="reset-card">
      <h2>Réinitialisation</h2>
      <p>Entrez votre nouveau mot de passe.</p>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleReset}>Réinitialiser</button>
    </div>
  );
};

export default ResetPassword;

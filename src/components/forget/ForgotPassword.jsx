import { useState } from "react";
import axios from "axios";


const ForgotPassword = ({ onNext }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post("https://backend-projet-7mvc.onrender.com/api/v1/auth/forgotPassword", {
        email,
      });
      alert("Code de réinitialisation envoyé !");
      onNext(email);
      
    } catch (err) {
      alert("Erreur : " + err.response?.data.message || "Échec de l'envoi.");
    }
  };

  return (
    <div className="reset-card">
      <h2>Mot de passe oublié ?</h2>
      <p>
        Entrez votre adresse email pour recevoir un code de réinitialisation.
      </p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit}>Envoyer le code</button>
    </div>
  );
};

export default ForgotPassword;

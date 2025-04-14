import { useState } from "react";

import axios from "axios";

const VerifyResetCode = ({  onVerified }) => {
  const [code, setCode] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post("https://backend-projet-7mvc.onrender.com/api/v1/auth/verifyResetCode", {
        resetCode: code,
      });
      alert("Code vérifié !");
      onVerified();
    } catch (err) {
      alert("Code invalide ou expiré.");
    }
  };

  return (
    <div className="reset-card">
      <h2>Vérification du code</h2>
      <p>Entrez le code reçu par email.</p>
      <input
        type="text"
        placeholder="Code à 6 chiffres"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleSubmit}>Vérifier</button>
    </div>
  );
};

export default VerifyResetCode;

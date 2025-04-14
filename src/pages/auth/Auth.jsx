import { useState } from "react";
import axios from "axios";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthConext";
const Connexion = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const response = await axios.post(
        "https://backend-projet-7mvc.onrender.com/api/v1/auth/login",
        credentials
      );
      alert("Connexion réussie !");
      login(response.data.token, response.data.data._id, response.data.data.role);
      navigate("/");
    } catch (error) {
      console.error("Erreur de connexion:", error.response?.data || error);
      setErrorMsg(error.response?.data?.message || "Échec de la connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="box connexion-box">
      <h2>Connexion</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Mot de passe"
        onChange={handleChange}
      />
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Connexion..." : "Se connecter"}
      </button>
      <Link to={`/auth/reset`} className="username-link">
        Mot de passe oublié?
      </Link>
    </div>
  );
};

const Inscription = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    confirmEmail: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePicture, setprofilePicture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setErrorMsg("");

    if (formData.email !== formData.confirmEmail) {
      setErrorMsg("Les emails ne se correspondent pas !");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Les mots de passe ne se correspondent pas !");
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("email", formData.email);
      data.append("username", formData.username);
      data.append("password", formData.password);
      if (profilePicture) {
        data.append("profilePicture", profilePicture);
      }

      const response = await axios.post(
        "https://backend-projet-7mvc.onrender.com/api/v1/auth/signup",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Inscription réussie !");
      login(response.data.token,response.data.data._id);
      navigate("/");
    } catch (error) {
      console.error("Erreur d'inscription:", error.response?.data || error);
      setErrorMsg(error.response?.data?.message || "Échec de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="box inscription-box">
      <h2>Inscription</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        type="email"
        name="confirmEmail"
        placeholder="Confirmer Email"
        onChange={handleChange}
      />
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Mot de passe"
        onChange={handleChange}
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirmer Mot de passe"
        onChange={handleChange}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setprofilePicture(e.target.files[0])}
      />
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
      <button onClick={handleRegister} disabled={isLoading}>
        {isLoading ? "Inscription..." : "S'inscrire"}
      </button>
    </div>
  );
};

const Auth = () => {
  return (
    <div className="container">
      <Connexion />
      <Inscription />
    </div>
  );
};

export default Auth;

import "./navbar.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthConext";
import { useState } from "react";

const NavBar = () => {
  const { token, logOut, userId } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">📖 Roombakkd</Link>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li>
          {token ? (
            <Link to="/auth" onClick={logOut}>
              Se déconnecter
            </Link>
          ) : (
            <Link to="/auth">Connexion|Inscription</Link>
          )}
        </li>
        <li>
          <Link to="/">Livres</Link>
        </li>
        <li>
          {token ? (
            <Link to={`/user/${userId}`}>Ton profil</Link>
          ) : (
            <Link to="/auth">Ton profil</Link>
          )}
        </li>
      </ul>

      <div className="search">
        <Link to="/search">🔍</Link>
      </div>
    </nav>
  );
};

export default NavBar;

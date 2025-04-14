import './navbar.css'
import { Link } from "react-router-dom";
import { useAuth } from '../../utils/AuthConext';
const NavBar = () => {
  const {token,logOut,userId} =useAuth();
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">📖 Roombakkd</Link>
      </div>
      <ul className="nav-links">
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
          <li>{token?( <Link to={`/user/${userId}`}>Ton profil</Link>):
          (<Link to="/auth">Ton profil</Link>)
          }
           
          </li>
        </li>
      </ul>
      <div className="search">
        <Link to="/search">🔍</Link>
      </div>
    </nav>
  );
};



export default NavBar;

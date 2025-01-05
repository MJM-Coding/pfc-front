import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons"; 
import { NavLink } from "react-router-dom"; // Import de NavLink
import "./footer.scss"; 
import "../../styles/commun/commun.scss"

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Réseaux sociaux */}
        <div className="social-media">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon facebook"
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon instagram"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>

        {/* Liens */}
        <div className="footer-links">
     
          <NavLink
            to="/a-propos"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            À propos
          </NavLink>
        </div>

        {/* Copyright */}
        <div className="copyright">
          <p>&copy; 2024 Pet Foster Connect. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

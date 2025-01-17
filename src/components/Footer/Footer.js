import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';
import logo from '../../assets/logo1.jpg';
import Logo2 from '../../assets/lg2.png';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const { language, translations } = useLanguage();
  const t = translations[language];

  const handleNavClick = (e, path) => {
    if (path === '/services') {
      e.preventDefault();
      if (location.pathname === '/') {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = '/#services';
      }
    }
  };

  const socialLinks = [
    { 
      icon: <Phone size={24} />, 
      url: 'tel:+351919664601',
      label: language === 'pt' ? 'Telefone' : 'Phone'
    },
    {
      icon: <Mail size={24} />,
      url: 'mailto:miguelamtransportes@gmail.com',
      label: 'Email'
    }
  ];

  const footerLinks = [
    {
      title: t.navigation,
      links: [
        { name: t.home, path: '/' },
        { name: t.services, path: '/services' },
        { name: t.contact, path: '/contactus' },
        { name: t.priceCalculator, path: '/quotation' },
      ],
    },
    {
      title: t.legal,
      links: [
        { name: t.privacyPolicy, path: '/privacy' },
        { name: t.termsOfUse, path: '/terms' },
        { name: t.legalInfo, path: '/legal' },
      ],
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo-container">
            <img src={logo} alt="Miguel AM Transportes Logo" className="footer-logo" />
          </Link>
          <p className="footer-description">
            {t.weTransport}
          </p>
          <div className="social-links">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="social-icon"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="footer-links-container">
          {footerLinks.map((section, index) => (
            <div key={index} className="footer-section">
              <h3>{section.title}</h3>
              <ul>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.path}
                      onClick={(e) => handleNavClick(e, link.path)}
                      className="footer-link"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>
            &copy; {currentYear} Criado por TG Web Design. Miguel AM Transportes. {t.allRightsReserved}
          </p>
          <p>
          <a 
            href="https://tgwebdesign.netlify.app/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src={Logo2} 
              alt="TG Web Design Logo" 
              className="footer-logo2" 
              style={{ width: "60px", height: "auto", }} // Optional inline style
            />
          </a>
        </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
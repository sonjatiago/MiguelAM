import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../../assets/logo1.jpg';
import './NavBar.css';

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, translations } = useLanguage();

  const languages = [
    { 
      code: 'pt', 
      label: 'Português',
      flag: (
        <svg className="flag-icon" viewBox="0 0 640 480">
          <rect width="640" height="480" fill="#ff0000"/>
          <rect width="240" height="480" fill="#006600"/>
          <circle cx="240" cy="240" r="80" fill="#ffff00"/>
          <circle cx="240" cy="240" r="72" fill="#ff0000"/>
          <circle cx="240" cy="240" r="64" fill="#fff"/>
        </svg>
      )
    },
    { 
      code: 'en', 
      label: 'English',
      flag: (
        <svg className="flag-icon" viewBox="0 0 640 480">
          <rect width="640" height="480" fill="#012169"/>
          <path fill="#FFF" d="M75,0l244,181L562,0h78v62L400,241l240,178v61h-80L320,301L81,480H0v-60l239-178L0,64V0h75z"/>
          <path fill="#C8102E" d="M424,281l216,159v40L369,281H424z M240,301l6,35L54,480H0L240,301z M640,0v3L391,191l2-44L590,0H640z M0,0l239,176h-60L0,42V0z"/>
          <path fill="#FFF" d="M241,0v480h160V0H241zM0,160v160h640V160H0z"/>
          <path fill="#C8102E" d="M0,193v96h640v-96H0zM273,0v480h96V0H273z"/>
        </svg>
      )
    }
  ];

  const t = translations[language];

  const navItems = [
    { path: '/#home', label: t.home, section: 'home' },
    { path: '/#services', label: t.services, section: 'services' },
    { path: '/ContactUs', label: t.contactUs },
    { path: '/Quotation', label: t.priceCalculator }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const sections = ['home', 'services'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      setActiveSection(current || '');
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLangDropdownOpen && !event.target.closest('.language-switcher')) {
        setIsLangDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isLangDropdownOpen]);

  const handleNavClick = (e, path, section) => {
    e.preventDefault();
    if (path.startsWith('/#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode);
    setIsLangDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link 
          to="/" 
          className="logo-container"
          onClick={(e) => handleNavClick(e, '/#home', 'home')}
        >
          <img src={Logo} alt="Logo" className="logo" />
        </Link>

        <div className="nav-buttons">
          <nav className="desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${item.section ? 
                  (activeSection === item.section ? 'active' : '') : 
                  (location.pathname === item.path ? 'active' : '')}`}
                onClick={(e) => handleNavClick(e, item.path, item.section)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Desktop Language Switcher */}
            <div className="language-switcher">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLangDropdownOpen(!isLangDropdownOpen);
                }}
                className="nav-link lang-button"
              >
                {languages.find(lang => lang.code === language)?.flag}
              </button>

              <AnimatePresence>
                {isLangDropdownOpen && (
                  <motion.div 
                    className="lang-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageSelect(lang.code)}
                        className={`lang-option ${language === lang.code ? 'active' : ''}`}
                      >
                        {lang.flag}
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div 
                className="nav-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.div 
                className="nav-menu"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
              >
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item ${item.section ?
                      (activeSection === item.section ? 'active' : '') :
                      (location.pathname === item.path ? 'active' : '')}`}
                    onClick={(e) => handleNavClick(e, item.path, item.section)}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Mobile Language Switcher */}
                <div className="mobile-lang-switcher">
                  <p className="lang-label">Idioma / Language</p>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`nav-item ${language === lang.code ? 'active' : ''}`}
                    >
                      {lang.flag}
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
// src/components/LanguageSwitcher/index.jsx
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = () => {
    const newLanguage = language === 'pt' ? 'en' : 'pt';
    setLanguage(newLanguage);
  };

  return (
    <button
      onClick={handleLanguageChange}
      className="language-switcher-button"
      aria-label={`Switch to ${language === 'pt' ? 'English' : 'Portuguese'}`}
    >
      <div className={`flag-container ${language}`}>
        {language === 'pt' ? '🇵🇹' : '🇬🇧'}
      </div>
    </button>
  );
};

export default LanguageSwitcher;
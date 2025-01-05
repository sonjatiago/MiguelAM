import React, { useState, useEffect } from 'react';
import { Mail, Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import './ContactUs.css';

const ContactUs = () => {
  const { language, translations } = useLanguage();
  const t = translations[language];

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setFormSubmitted(true);
  };

  const contactInfo = {
    email: 'miguelamtransportes@gmail.com',
    phone: '+351 919664601'
  };

  return (
    <div className="contact-us">
      <h2>{t.contactUs}</h2>
      <p>{t.contactQuestion}</p>

      <div className="contact-container">
        <div className="contact-info">
          <h3>{t.contactInfo}</h3>
          <div className="info-item">
            <Mail size={20} />
            <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
          </div>
          <div className="info-item">
            <Phone size={20} />
            <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
          </div>
        </div>

        <div className="contact-form">
          {formSubmitted ? (
            <div className="success-message">
              <h3>{t.thankYou}</h3>
              <p>{t.willContact}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">{t.name}</label>
                <input
                  type="text"
                  name="nome"
                  id="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder={t.yourName}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">{t.email}</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.yourEmail}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mensagem">{t.message}</label>
                <textarea
                  name="mensagem"
                  id="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  placeholder={t.yourMessage}
                  required
                />
              </div>

              <button type="submit">{t.sendMessage}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
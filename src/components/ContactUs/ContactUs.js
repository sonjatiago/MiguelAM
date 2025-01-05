import React, { useState, useEffect } from 'react';
import { Mail, Phone } from 'lucide-react';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  // Add useEffect to scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this runs once when component mounts

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
      <h2>Contacte-nos</h2>
      <p>Se tiver alguma dúvida ou questão, não hesite em entrar em contacto connosco!</p>

      <div className="contact-container">
        <div className="contact-info">
          <h3>Informações de Contacto</h3>
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
              <h3>Obrigado pelo seu contacto!</h3>
              <p>Em breve entraremos em contacto consigo.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">Nome:</label>
                <input
                  type="text"
                  name="nome"
                  id="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="O seu nome"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="O seu email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mensagem">Mensagem:</label>
                <textarea
                  name="mensagem"
                  id="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  placeholder="A sua mensagem"
                  required
                />
              </div>

              <button type="submit">Enviar Mensagem</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
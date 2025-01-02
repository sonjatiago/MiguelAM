import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { NavBar } from './components/NavBar/NavBar';
import Homepage from './components/Homepage/Homepage';
import ContactUs from './components/ContactUs/ContactUs';
import Quotation from "./components/Quotation/Quotation";
import './App.css';

// Page transition wrapper component
const PageWrapper = ({ children }) => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className={`page-wrapper ${isAnimating ? 'fade-enter' : 'fade-enter-active'}`}>
      {children}
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <PageWrapper>
                <Homepage />
              </PageWrapper>
            } />
            <Route path="/contactus" element={
              <PageWrapper>
                <ContactUs />
              </PageWrapper>
            } />
            <Route path="/quotation" element={
              <PageWrapper>
                <Quotation />
              </PageWrapper>
            } />
          </Routes>
        </main>
        
        {/* Back to top button */}
        <button 
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      </div>
    </Router>
  );
}

export default App;
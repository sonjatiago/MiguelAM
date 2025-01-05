import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { NavBar } from './components/NavBar/NavBar';
import Homepage from './components/Homepage/Homepage';
import ContactUs from './components/ContactUs/ContactUs';
import Quotation from "./components/Quotation/Quotation";
import { Footer } from "./components/Footer/Footer";
import { LanguageProvider } from './context/LanguageContext';
import './App.css';

// Page transition wrapper component
const PageWrapper = ({ children }) => {
  const location = useLocation();
  
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="page-wrapper"
    >
      {children}
    </motion.div>
  );
};

// Loading component
const LoadingScreen = () => (
  <motion.div 
    className="loading-screen"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="loader"></div>
    <motion.p
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      Carregando...
    </motion.p>
  </motion.div>
);

// Scroll to top on route change
const ScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
};

// Back to top button component
const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.button 
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      ↑
    </motion.button>
  );
};

// Main App Content
const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" />
        ) : (
          <div className="app-container" key="content">
            <NavBar />
            <ScrollToTop />
            <main className="main-content">
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
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
              </AnimatePresence>
            </main>
            <Footer />
            <BackToTopButton />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </Router>
  );
}

export default App;
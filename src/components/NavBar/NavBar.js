import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '../../assets/logo1.jpg';
import './NavBar.css';

export const NavBar = () => {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [activeSection, setActiveSection] = useState('');
 const location = useLocation();
 const navigate = useNavigate();

 const navItems = [
   { path: '/#home', label: 'Início', section: 'home' },
   { path: '/#services', label: 'Serviços', section: 'services' },
   { path: '/ContactUs', label: 'Entre em contacto' },
   { path: '/Quotation', label: 'Calculador de preços' }
 ];

 useEffect(() => {
   const handleScroll = () => {
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
   return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 const handleNavClick = (e, path, section) => {
   e.preventDefault();
   
   if (path.startsWith('/#')) {
     if (location.pathname !== '/') {
       navigate('/');
       setTimeout(() => {
         const element = document.getElementById(section);
         if (element) {
           element.scrollIntoView({ behavior: 'smooth' });
         }
       }, 100);
     } else {
       const element = document.getElementById(section);
       if (element) {
         element.scrollIntoView({ behavior: 'smooth' });
       }
     }
   } else {
     navigate(path);
   }
   setIsMenuOpen(false);
 };

 return (
   <header className="navbar">
     <div className="navbar-container">
       <Link 
         to="/" 
         className="logo-container"
         onClick={(e) => handleNavClick(e, '/#home', 'home')}
       >
         <img src={Logo} alt="Logo" className="logo" />
       </Link>

       <nav className="desktop-nav">
         {navItems.map((item) => (
           <Link
             key={item.path}
             to={item.path}
             className={`nav-link ${
               item.section ? 
                 (activeSection === item.section ? 'active' : '') : 
                 (location.pathname === item.path ? 'active' : '')
             }`}
             onClick={(e) => handleNavClick(e, item.path, item.section)}
           >
             {item.label}
           </Link>
         ))}
       </nav>

       <button 
         className="menu-toggle"
         onClick={() => setIsMenuOpen(!isMenuOpen)}
         aria-label="Toggle menu"
       >
         {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
       </button>

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
                   className={`nav-item ${
                     item.section ? 
                       (activeSection === item.section ? 'active' : '') : 
                       (location.pathname === item.path ? 'active' : '')
                   }`}
                   onClick={(e) => handleNavClick(e, item.path, item.section)}
                 >
                   {item.label}
                 </Link>
               ))}
             </motion.div>
           </>
         )}
       </AnimatePresence>
     </div>
   </header>
 );
};

export default NavBar;
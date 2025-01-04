import React, { useState } from 'react';
import { Truck, Plane, ArrowRight, Box, BarChart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo1.jpg';
import './Homepage.css';

const Homepage = () => {
 const [activeTab, setActiveTab] = useState('road');
 const [expandedFeature, setExpandedFeature] = useState(null);

 const stats = [
   { icon: <Truck />, value: "5000+", label: "Entregas Mensais" },
   { icon: <Users />, value: "98%", label: "Clientes Satisfeitos" },
   { icon: <Box />, value: "50+", label: "Países Atendidos" },
   { icon: <BarChart />, value: "24/7", label: "Suporte Dedicado" }
 ];

 const services = React.useMemo(() => ({
   road: {
     icon: <Truck className="service-icon" />,
     title: "Transporte Rodoviário",
     description: "Entregas porta a porta em Portugal e Espanha.",
     features: [
       {
         icon: "⏱️",
         title: "Entregas Rápidas",
         description: "Entregas em 24-48 horas em toda Península Ibérica",
         details: "Serviço premium de entregas rápidas com monitoramento constante e garantia de prazos."
       },
       {
         icon: "🚛",
         title: "Frota Moderna",
         description: "Veículos modernos até 3,5 toneladas",
         details: "Frota atualizada com tecnologia de ponta e manutenção preventiva regular."
       },
       {
         icon: "🌍",
         title: "Ampla Cobertura",
         description: "Serviço em toda Península Ibérica",
         details: "Rede logística estrategicamente posicionada para máxima eficiência de entrega."
       }
     ]
   },
   air: {
     icon: <Plane className="service-icon" />,
     title: "Transporte Aéreo", 
     description: "Entregas internacionais expressas com prioridade máxima.",
     features: [
       {
         icon: "✈️",
         title: "Express Global",
         description: "Entregas internacionais em tempo recorde",
         details: "Parcerias com as principais companhias aéreas para entregas ultra-rápidas."
       },
       {
         icon: "🔒",
         title: "Segurança Total",
         description: "Proteção especial para cargas valiosas",
         details: "Seguro premium e monitoramento 24h para máxima segurança."
       },
       {
         icon: "📦",
         title: "Cargas Especiais",
         description: "Transporte de mercadorias sensíveis",
         details: "Equipamentos especializados para transporte de itens delicados."
       },
       {
         icon: "🌐",
         title: "Cobertura Mundial",
         description: "Entrega para qualquer destino global",
         details: "Rede global de parceiros para entregas em qualquer lugar do mundo."
       }
     ]
   }
 }), []);

 const handleFeatureClick = React.useCallback((index) => {
   setExpandedFeature(prev => prev === index ? null : index);
 }, []);

 return (
   <div className="homepage">
     <div id="home" className="hero-section">
       <div className="animated-bg"></div>
       <div className="hero-content">
         <img src={Logo} alt="MiguelAM Transportes Logo" className="logo2" />
         <h1>
           <span className="highlight">Transportamos</span> a sua urgência
         </h1>
         <div className="cta-group">
           <Link to="/quotation" className="cta-button primary">
             <span>Solicitar Orçamento</span>
             <ArrowRight className="icon" />
           </Link>
         </div>
       </div>
     </div>

     <div className="stats-section">
       {stats.map((stat, index) => (
         <div key={index} className="stat-card">
           {stat.icon}
           <h3>{stat.value}</h3>
           <p>{stat.label}</p>
         </div>
       ))}
     </div>

     <div id="services" className="services-section">
       <div className="services-header">
         <h2>As Nossas Soluções de Transporte</h2>
         <p className="services-subtitle">Escolha o serviço ideal para sua necessidade</p>
       </div>

       <div className="services-tabs">
         {Object.entries(services).map(([key, service]) => (
           <button 
             key={key}
             className={`tab ${activeTab === key ? 'active' : ''}`}
             onClick={() => setActiveTab(key)}
           >
             {React.cloneElement(service.icon, { className: 'tab-icon' })}
             <span>
               {key === 'road' ? 'Península Ibérica' : 'Internacional'}
             </span>
           </button>
         ))}
       </div>

       <div className="services-content">
         <div className="service-panel">
           <div className="service-header">
             {services[activeTab].icon}
             <div>
               <h3>{services[activeTab].title}</h3>
               <p className="service-description">{services[activeTab].description}</p>
             </div>
           </div>
           
           <div className="features-grid">
             {services[activeTab].features.map((feature, index) => (
               <div 
                 key={index}
                 className={`feature-item ${expandedFeature === index ? 'expanded' : ''}`}
                 onClick={() => handleFeatureClick(index)}
               >
                 <div className="feature-item-header">
                   <div className="feature-icon">{feature.icon}</div>
                   <h4>{feature.title}</h4>
                   <div className="expand-icon">
                     {expandedFeature === index ? '−' : '+'}
                   </div>
                 </div>
                 <div className="feature-content">
                   <p className="feature-description">{feature.description}</p>
                   <div className="feature-details">
                     {feature.details}
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>
     </div>

     <div className="features-section">
       <div className="features-header">
         <h2>Porquê De Nos Escolher</h2>
         <p className="features-subtitle">Excelência em cada entrega</p>
       </div>
       
       <div className="features-grid">
         <div className="feature-card">
           <div className="icon-wrapper">
             <Box className="feature-icon" />
           </div>
           <h3>Tecnologia Avançada</h3>
           <p>Sistema de rastreamento em tempo real e gestão inteligente de rotas</p>
         </div>
         <div className="feature-card">
           <div className="icon-wrapper">
             <Users className="feature-icon" />
           </div>
           <h3>Equipa Especializada</h3>
           <p>Profissionais treinados e dedicados ao seu serviço</p>
         </div>
         <div className="feature-card">
           <div className="icon-wrapper">
             <BarChart className="feature-icon" />
           </div>
           <h3>Eficiência Comprovada</h3>
           <p>98% de entregas no prazo com satisfação garantida</p>
         </div>
       </div>
     </div>
   </div>
 );
};

export default React.memo(Homepage);
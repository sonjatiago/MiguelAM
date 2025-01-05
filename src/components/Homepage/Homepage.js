import React, { useState } from 'react';
import { Truck, Plane, ArrowRight, Box, BarChart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../../assets/logo1.jpg';
import './Homepage.css';

const Homepage = () => {
  const [activeTab, setActiveTab] = useState('road');
  const [expandedFeature, setExpandedFeature] = useState(null);
  const { language, translations } = useLanguage();
  const t = translations[language];

  const stats = [
    { icon: <Truck />, value: "5000+", label: t.monthlyDeliveries },
    { icon: <Users />, value: "98%", label: t.satisfiedCustomers },
    { icon: <Box />, value: "50+", label: t.countriesServed },
    { icon: <BarChart />, value: "24/7", label: t.dedicatedSupport }
  ];

  const services = React.useMemo(() => ({
    road: {
      icon: <Truck className="service-icon" />,
      title: t.roadTransport,
      description: t.roadTransportDesc,
      features: [
        {
          icon: "⏱️",
          title: t.fastDelivery,
          description: t.fastDeliveryDesc,
          details: t.fastDeliveryDetails
        },
        {
          icon: "🚛",
          title: t.modernFleet,
          description: t.modernFleetDesc,
          details: t.modernFleetDetails
        },
        {
          icon: "🌍",
          title: t.wideCoverage,
          description: t.wideCoverageDesc,
          details: t.wideCoverageDetails
        }
      ]
    },
    air: {
      icon: <Plane className="service-icon" />,
      title: t.airTransport,
      description: t.airTransportDesc,
      features: [
        {
          icon: "✈️",
          title: t.globalExpress,
          description: t.globalExpressDesc,
          details: t.globalExpressDetails
        },
        {
          icon: "🔒",
          title: t.totalSecurity,
          description: t.totalSecurityDesc,
          details: t.totalSecurityDetails
        },
        {
          icon: "📦",
          title: t.specialCargo,
          description: t.specialCargoDesc,
          details: t.specialCargoDetails
        },
        {
          icon: "🌐",
          title: t.worldwideCoverage,
          description: t.worldwideCoverageDesc,
          details: t.worldwideCoverageDetails
        }
      ]
    }
  }), [t]);

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
            <span className="highlight">{t.weTransportPart1}</span> {t.weTransportPart2}
          </h1>
          <div className="cta-group">
            <Link to="/quotation" className="cta-button primary">
              <span>{t.requestQuote}</span>
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
          <h2>{t.ourTransportSolutions}</h2>
          <p className="services-subtitle">{t.chooseIdealService}</p>
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
                {key === 'road' ? t.iberianPeninsula : t.international}
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
          <h2>{t.whyChooseUs}</h2>
          <p className="features-subtitle">{t.excellenceInDelivery}</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon-wrapper">
              <Box className="feature-icon" />
            </div>
            <h3>{t.advancedTechnology}</h3>
            <p>{t.advancedTechnologyDesc}</p>
          </div>
          <div className="feature-card">
            <div className="icon-wrapper">
              <Users className="feature-icon" />
            </div>
            <h3>{t.specializedTeam}</h3>
            <p>{t.specializedTeamDesc}</p>
          </div>
          <div className="feature-card">
            <div className="icon-wrapper">
              <BarChart className="feature-icon" />
            </div>
            <h3>{t.provenEfficiency}</h3>
            <p>{t.provenEfficiencyDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Homepage);
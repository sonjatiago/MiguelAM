// src/context/LanguageContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import '../components/LanguageSwitcher';

const translations = {
  pt: {
    // Navigation
    navigation: 'Navegação',
    home: 'Início',
    services: 'Serviços',
    contact: 'Entre em contacto',
    priceCalculator: 'Calculador de preços',
    
    // Footer
    legal: 'Legal',
    privacyPolicy: 'Política de Privacidade',
    termsOfUse: 'Termos de Uso',
    legalInfo: 'Informações Legais',
    madeBy: 'Made by Tiago Guimarães.',
    allRightsReserved: 'Todos os direitos reservados.',
    phone: 'Telefone',

    // Homepage
    weTransport: 'Transportamos a sua urgência',
    requestQuote: 'Solicitar Orçamento',
    monthlyDeliveries: 'Entregas Mensais',
    satisfiedCustomers: 'Clientes Satisfeitos',
    countriesServed: 'Países Atendidos',
    dedicatedSupport: 'Suporte Dedicado',
     // Homepage Hero Section
     weTransportPart1: "Transportamos",
     weTransportPart2: "a sua urgência",
 
     // Homepage Services Section
     ourTransportSolutions: "As Nossas Soluções de Transporte",
     chooseIdealService: "Escolha o serviço ideal para sua necessidade",
     iberianPeninsula: "Península Ibérica",
     international: "Internacional",
 
     // Transport Services
     roadTransport: "Transporte Rodoviário",
     roadTransportDesc: "Entregas porta a porta em Portugal e Espanha",
     airTransport: "Transporte Aéreo",
     airTransportDesc: "Entregas internacionais expressas com prioridade máxima",
 
     // Features
     fastDelivery: "Entregas Rápidas",
     fastDeliveryDesc: "Entregas em 24-48 horas em toda Península Ibérica",
     fastDeliveryDetails: "Serviço premium de entregas rápidas com monitoramento constante e garantia de prazos",
     
     modernFleet: "Frota Moderna",
     modernFleetDesc: "Veículos modernos até 3,5 toneladas",
     modernFleetDetails: "Frota atualizada com tecnologia de ponta e manutenção preventiva regular",
     
     wideCoverage: "Ampla Cobertura",
     wideCoverageDesc: "Serviço em toda Península Ibérica",
     wideCoverageDetails: "Rede logística estrategicamente posicionada para máxima eficiência de entrega",
     
     globalExpress: "Express Global",
     globalExpressDesc: "Entregas internacionais em tempo recorde",
     globalExpressDetails: "Parcerias com as principais companhias aéreas para entregas ultra-rápidas",
     
     totalSecurity: "Segurança Total",
     totalSecurityDesc: "Proteção especial para cargas valiosas",
     totalSecurityDetails: "Seguro premium e monitoramento 24h para máxima segurança",
     
     specialCargo: "Cargas Especiais",
     specialCargoDesc: "Transporte de mercadorias sensíveis",
     specialCargoDetails: "Equipamentos especializados para transporte de itens delicados",
     
     worldwideCoverage: "Cobertura Mundial",
     worldwideCoverageDesc: "Entrega para qualquer destino global",
     worldwideCoverageDetails: "Rede global de parceiros para entregas em qualquer lugar do mundo",
// Why Choose Us Section
whyChooseUs: "Porquê De Nos Escolher",
excellenceInDelivery: "Excelência em cada entrega",
advancedTechnology: "Tecnologia Avançada",
advancedTechnologyDesc: "Sistema de rastreamento em tempo real e gestão inteligente de rotas",
specializedTeam: "Equipa Especializada",
specializedTeamDesc: "Profissionais treinados e dedicados ao seu serviço",
provenEfficiency: "Eficiência Comprovada",
provenEfficiencyDesc: "98% de entregas no prazo com satisfação garantida", 
    // Contact Form
    contactUs: 'Contacte-nos',
    contactQuestion: 'Se tiver alguma dúvida ou questão, não hesite em entrar em contacto connosco!',
    contactInfo: 'Informações de Contacto',
    name: 'Nome:',
    email: 'Email:',
    message: 'Mensagem:',
    sendMessage: 'Enviar Mensagem',
    thankYou: 'Obrigado pelo seu contacto!',
    willContact: 'Em breve entraremos em contacto consigo.',
    yourName: 'O seu nome',
    yourEmail: 'O seu email',
    yourMessage: 'A sua mensagem',

    // Quotation Page
    getQuote: 'Obter Cotação',
    calculateShippingCosts: 'Calcule os custos de envio instantaneamente',
    serviceType: 'Tipo de Serviço',
    landTransportIberia: 'Terreste dentro da Península Ibérica',
    internationalAir: 'Avião Internacional',
    originLocation: 'Local de Origem',
    destinationLocation: 'Local de Destino',
    enterLocation: 'Introduza',
    weight: 'Peso (kg)',
    enterWeight: 'Introduza o peso',
    numberOfVolumes: 'Número de Volumes',
    enterVolumes: 'Introduza o número de volumes',
    dimensions: 'Dimensões (cm)',
    length: 'Comprimento',
    width: 'Largura',
    height: 'Altura',
    calculating: 'A calcular...',
    calculatePrice: 'Calcular Preço',
    
    // Summary Section
    totalPrice: 'Preço Total (ida e volta)',
    vehicleType: 'Tipo de Veículo',
    maxDimensions: 'Dimensões máximas (cm)',
    volumePerUnit: 'Volume por Unidade',
    totalVolume: 'Volume Total',
    pricePerKm: 'Preço por km',
    oneWayDistance: 'Distância (ida)',
    roundTripDistance: 'Distância Total (ida e volta)',
    quotationEmail: 'O preço do seu orçamento será calculado e enviado por email',
    orderDetails: 'Detalhes da Sua Encomenda:',
    origin: 'Origem:',
    destination: 'Destino:',
    
    // Validation Messages
    pleaseEnterWeight: 'Por favor, introduza o peso',
    pleaseEnterVolumes: 'Por favor, introduza o número de volumes',
    pleaseEnterDimensions: 'Por favor, preencha todas as dimensões',
    weightMustBePositive: 'O peso deve ser maior que zero',
    dimensionsMustBePositive: 'As dimensões devem ser maiores que zero',
    volumesMustBePositive: 'O número de volumes deve ser maior que zero',
    weightExceedsLimit: 'Peso excede o limite máximo permitido',
    volumeExceedsLimit: 'Volume total excede o limite máximo permitido',
    selectValidAddress: 'Por favor, selecione um endereço válido das sugestões',
    addressSuggestionFailed: 'Falha ao obter sugestões de endereço',
    pleaseEnterName: 'Por favor, preencha seu nome',
    pleaseEnterEmail: 'Por favor, preencha seu email',
    
    // Success Messages
    quoteSuccess: 'O seu pedido de orçamento foi feito com sucesso. A nossa equipa está a trabalhar para lhe dar uma resposta o mais breve possível.',
    sendRequest: 'Enviar Pedido',
    enterYourName: 'Introduza o seu nome',
    enterYourEmail: 'Introduza o seu email',

    // Loading
    loading: 'Carregando...'
  },
  en: {
    // Navigation
    navigation: 'Navigation',
    home: 'Home',
    services: 'Services',
    contact: 'Contact Us',
    priceCalculator: 'Price Calculator',
    
    // Footer
    legal: 'Legal',
    privacyPolicy: 'Privacy Policy',
    termsOfUse: 'Terms of Use',
    legalInfo: 'Legal Information',
    madeBy: 'Made by Tiago Guimarães.',
    allRightsReserved: 'All rights reserved.',
    phone: 'Phone',

    // Homepage
    weTransport: 'We transport your urgency',
    requestQuote: 'Request Quote',
    monthlyDeliveries: 'Monthly Deliveries',
    satisfiedCustomers: 'Satisfied Customers',
    countriesServed: 'Countries Served',
    dedicatedSupport: 'Dedicated Support',
    
    // Contact Form
    contactUs: 'Contact Us',
    contactQuestion: 'If you have any questions or inquiries, don\'t hesitate to contact us!',
    contactInfo: 'Contact Information',
    name: 'Name:',
    email: 'Email:',
    message: 'Message:',
    sendMessage: 'Send Message',
    thankYou: 'Thank you for contacting us!',
    willContact: 'We will get back to you soon.',
    yourName: 'Your name',
    yourEmail: 'Your email',
    yourMessage: 'Your message',

    // Quotation Page
    getQuote: 'Get Quote',
    calculateShippingCosts: 'Calculate shipping costs instantly',
    serviceType: 'Service Type',
    landTransportIberia: 'Land Transport within Iberian Peninsula',
    internationalAir: 'International Air',
    originLocation: 'Origin Location',
    destinationLocation: 'Destination Location',
    enterLocation: 'Enter',
    weight: 'Weight (kg)',
    enterWeight: 'Enter weight',
    numberOfVolumes: 'Number of Volumes',
    enterVolumes: 'Enter number of volumes',
    dimensions: 'Dimensions (cm)',
    length: 'Length',
    width: 'Width',
    height: 'Height',
    calculating: 'Calculating...',
    calculatePrice: 'Calculate Price',
    
    // Summary Section
    totalPrice: 'Total Price (round trip)',
    vehicleType: 'Vehicle Type',
    maxDimensions: 'Maximum dimensions (cm)',
    volumePerUnit: 'Volume per Unit',
    totalVolume: 'Total Volume',
    pricePerKm: 'Price per km',
    oneWayDistance: 'Distance (one way)',
    roundTripDistance: 'Total Distance (round trip)',
    quotationEmail: 'The price of your quote will be calculated and sent by email',
    orderDetails: 'Your Order Details:',
    origin: 'Origin:',
    destination: 'Destination:',

    // Validation Messages
    pleaseEnterWeight: 'Please enter weight',
    pleaseEnterVolumes: 'Please enter number of volumes',
    pleaseEnterDimensions: 'Please enter all dimensions',
    weightMustBePositive: 'Weight must be greater than zero',
    dimensionsMustBePositive: 'Dimensions must be greater than zero',
    volumesMustBePositive: 'Number of volumes must be greater than zero',
    weightExceedsLimit: 'Weight exceeds maximum allowed limit',
    volumeExceedsLimit: 'Total volume exceeds maximum allowed limit',
    selectValidAddress: 'Please select a valid address from suggestions',
    addressSuggestionFailed: 'Failed to get address suggestions',
    pleaseEnterName: 'Please enter your name',
    pleaseEnterEmail: 'Please enter your email',
    
    // Success Messages
    quoteSuccess: 'Your quote request has been successfully submitted. Our team is working to provide you with a response as soon as possible.',
    sendRequest: 'Send Request',
    enterYourName: 'Enter your name',
    enterYourEmail: 'Enter your email',

    // Loading
    loading: 'Loading...',

    // Homepage Hero Section
    weTransportPart1: "We Transport",
    weTransportPart2: "your urgency",

    // Homepage Services Section
    ourTransportSolutions: "Our Transport Solutions",
    chooseIdealService: "Choose the ideal service for your needs",
    iberianPeninsula: "Iberian Peninsula",
    international: "International",

    // Transport Services
    roadTransport: "Road Transport",
    roadTransportDesc: "Door-to-door deliveries in Portugal and Spain",
    airTransport: "Air Transport",
    airTransportDesc: "Express international deliveries with maximum priority",

    // Features
    fastDelivery: "Fast Delivery",
    fastDeliveryDesc: "24-48 hour deliveries across the Iberian Peninsula",
    fastDeliveryDetails: "Premium delivery service with constant monitoring and guaranteed deadlines",
    
    modernFleet: "Modern Fleet",
    modernFleetDesc: "Modern vehicles up to 3.5 tons",
    modernFleetDetails: "Updated fleet with cutting-edge technology and regular preventive maintenance",
    
    wideCoverage: "Wide Coverage",
    wideCoverageDesc: "Service throughout the Iberian Peninsula",
    wideCoverageDetails: "Strategically positioned logistics network for maximum delivery efficiency",
    
    globalExpress: "Global Express",
    globalExpressDesc: "Record-time international deliveries",
    globalExpressDetails: "Partnerships with major airlines for ultra-fast deliveries",
    
    totalSecurity: "Total Security",
    totalSecurityDesc: "Special protection for valuable cargo",
    totalSecurityDetails: "Premium insurance and 24/7 monitoring for maximum security",
    
    specialCargo: "Special Cargo",
    specialCargoDesc: "Transport of sensitive goods",
    specialCargoDetails: "Specialized equipment for handling delicate items",
    
    worldwideCoverage: "Worldwide Coverage",
    worldwideCoverageDesc: "Delivery to any global destination",
    worldwideCoverageDetails: "Global network of partners for deliveries anywhere in the world",

    // Why Choose Us Section
    whyChooseUs: "Why Choose Us",
    excellenceInDelivery: "Excellence in every delivery",
    advancedTechnology: "Advanced Technology",
    advancedTechnologyDesc: "Real-time tracking system and intelligent route management",
    specializedTeam: "Specialized Team",
    specializedTeamDesc: "Trained professionals dedicated to your service",
    provenEfficiency: "Proven Efficiency",
    provenEfficiencyDesc: "98% on-time deliveries with guaranteed satisfaction"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Initialize language from localStorage or default to 'pt'
  const [language, setLanguageState] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'pt';
  });

  // Persist language choice to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguageState(newLanguage);
    }
  };

  // Keep toggleLanguage for components that need it
  const toggleLanguage = () => {
    setLanguageState(prev => prev === 'pt' ? 'en' : 'pt');
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
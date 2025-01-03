import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { MapPin, Package, Send, Plane } from 'lucide-react';
import debounce from 'lodash/debounce';

const PRICE_CONFIG = {
  aviao: { baseRate: 2, weightFactor: 1 },
  carrinha: { 
    baseRate: 2,
    weightRanges: [
      { max: 1000, factor: 1 },
      { max: 3500, factor: 1.5 },
    ]
  }
};

const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Returns distance in kilometers
};

const toRad = value => (value * Math.PI) / 180;

const LocationInput = ({ label, value, suggestions, onChange, onSelect }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    if (value === '') {
      setInputValue('');
      setSelectedValue('');
    }
  }, [value]);

  const handleSuggestionClick = (suggestion) => {
    const formattedAddress = suggestion.formatted;
    setSelectedValue(formattedAddress);
    setInputValue(formattedAddress);
    onSelect(suggestion);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedValue('');
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={selectedValue || inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="w-full p-2 border rounded-lg"
          placeholder={`Introduza ${label.toLowerCase()}`}
          required
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg max-h-48 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-2 hover:bg-gray-50 cursor-pointer"
              >
                {suggestion.formatted}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const Quotation = () => {
  const summaryRef = useRef(null);
  
  const [formData, setFormData] = useState({
    serviceType: 'carrinha',
    startLocation: '',
    endLocation: '',
    weight: '',
    volumes: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    clientName: '',
    clientEmail: ''
  });
  
  const [state, setState] = useState({
    quotation: null,
    distance: null,
    loading: false,
    error: null,
    isCalculated: false
  });

  const [suggestions, setSuggestions] = useState({
    start: [],
    end: []
  });

  const apiKey = '7747d85f0d034e54a29de6f865fee8f2';

  const getButtonStyles = (type) => {
    const baseStyles = "p-4 rounded-lg border flex items-center gap-2 transition-all duration-200 w-full";
    
    const styles = {
      carrinha: formData.serviceType === 'carrinha'
        ? 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600'
        : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700',
      aviao: formData.serviceType === 'aviao'
        ? 'border-green-500 bg-green-500 text-white hover:bg-green-600'
        : 'border-gray-200 hover:border-green-500 hover:bg-green-50 text-gray-700'
    };

    return `${baseStyles} ${styles[type]}`;
  };

  const getAddressSuggestions = useCallback(async (query, type) => {
    if (!query) {
      setSuggestions(prev => ({ ...prev, [type]: [] }));
      return;
    }

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}&language=pt`
      );
      const data = await response.json();
      const formattedSuggestions = data.results.map(result => ({
        formatted: result.formatted,
        geometry: result.geometry
      }));
      
      setSuggestions(prev => ({ ...prev, [type]: formattedSuggestions }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Falha ao obter sugestões de endereço' }));
    }
  }, [apiKey]);

  const debouncedSearch = useMemo(() => ({
    start: debounce(q => getAddressSuggestions(q, 'start'), 300),
    end: debounce(q => getAddressSuggestions(q, 'end'), 300)
  }), [getAddressSuggestions]);

  const calculatePrice = useCallback((distance, serviceType, weight) => {
    if (serviceType === 'aviao') return null;
    
    const config = PRICE_CONFIG[serviceType];
    const basePrice = config.baseRate * distance;
    
    const weightRange = config.weightRanges.find(range => weight <= range.max);
    const weightPrice = basePrice * (weightRange?.factor || 1);
    
    return {
      totalPrice: basePrice + weightPrice,
      breakdown: { basePrice, weightPrice }
    };
  }, []);

  const resetForm = (serviceType) => {
    setFormData(prev => ({
      ...prev,
      serviceType,
      startLocation: '',
      endLocation: '',
      weight: '',
      volumes: '',
      dimensions: {
        length: '',
        width: '',
        height: ''
      }
    }));
    setSuggestions({ start: [], end: [] });
    setState(prev => ({ ...prev, isCalculated: false, quotation: null, error: null }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!formData.serviceType) {
      setState(prev => ({ ...prev, error: 'Por favor, selecione um tipo de serviço' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const startCoords = suggestions.start[0]?.geometry;
      const endCoords = suggestions.end[0]?.geometry;
      
      if (!startCoords || !endCoords) {
        throw new Error('Por favor, selecione endereços válidos das sugestões');
      }

      const distance = calculateHaversineDistance(
        startCoords.lat,
        startCoords.lng,
        endCoords.lat,
        endCoords.lng
      );

      const quotation = calculatePrice(
        distance,
        formData.serviceType,
        parseFloat(formData.weight) || 0
      );

      setState(prev => ({
        ...prev,
        distance,
        quotation,
        isCalculated: true,
        loading: false
      }));

      // Add smooth scrolling after state update
      setTimeout(() => {
        summaryRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
    }
  };

  const handleFinalSubmit = () => {
    if (!formData.clientName || !formData.clientEmail) {
      setState(prev => ({ ...prev, error: 'Por favor, preencha seu nome e email' }));
      return;
    }
    // Handle final submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Obter Cotação</h2>
        <p className="text-gray-600">Calcule os custos de envio instantaneamente</p>
      </div>

      {state.error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-lg">
          {state.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Tipo de Serviço
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => resetForm('carrinha')}
                className={getButtonStyles('carrinha')}
              >
                <Package className={`h-5 w-5 ${formData.serviceType === 'carrinha' ? 'text-white' : 'text-gray-600'}`} />
                <span>Terreste dentro da Península Ibérica</span>
              </button>
              <button
                type="button"
                onClick={() => resetForm('aviao')}
                className={getButtonStyles('aviao')}
              >
                <Plane className={`h-5 w-5 ${formData.serviceType === 'aviao' ? 'text-white' : 'text-gray-600'}`} />
                <span>Avião Internacional</span>
              </button>
            </div>
          </div>

          <LocationInput
            label="Local de Origem"
            value={formData.startLocation}
            suggestions={suggestions.start}
            onChange={val => {
              setFormData(prev => ({ ...prev, startLocation: val }));
              debouncedSearch.start(val);
            }}
            onSelect={suggestion => {
              setFormData(prev => ({ ...prev, startLocation: suggestion.formatted }));
              setSuggestions(prev => ({ ...prev, start: [suggestion] }));
            }}
          />

          <LocationInput
            label="Local de Destino"
            value={formData.endLocation}
            suggestions={suggestions.end}
            onChange={val => {
              setFormData(prev => ({ ...prev, endLocation: val }));
              debouncedSearch.end(val);
            }}
            onSelect={suggestion => {
              setFormData(prev => ({ ...prev, endLocation: suggestion.formatted }));
              setSuggestions(prev => ({ ...prev, end: [suggestion] }));
            }}
          />

          {(formData.serviceType === 'carrinha' || formData.serviceType === 'aviao') && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={e => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Introduza o peso"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Número de Volumes
                </label>
                <input
                  type="number"
                  value={formData.volumes}
                  onChange={e => setFormData(prev => ({ ...prev, volumes: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Introduza o número de volumes"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Dimensões (cm)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    value={formData.dimensions.length}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      dimensions: { ...prev.dimensions, length: e.target.value }
                    }))}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Comprimento"
                    required
                  />
                  <input
                    type="number"
                    value={formData.dimensions.width}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      dimensions: { ...prev.dimensions, width: e.target.value }
                    }))}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Largura"
                    required
                  />
                  <input
                    type="number"
                    value={formData.dimensions.height}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      dimensions: { ...prev.dimensions, height: e.target.value }
                    }))}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Altura"
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={state.loading}
          className="w-full bg-blue-600 text-white p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
          {state.loading ? 'A calcular...' : 'Calcular Preço'}
        </button>
      </form>

      {state.isCalculated && (
        <div ref={summaryRef} className="space-y-6 p-6 bg-gray-50 rounded-lg">
          {formData.serviceType === 'carrinha' ? (
            <>
              <div>
                <div className="text-2xl font-bold">
                  €{state.quotation.totalPrice.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Preço Total</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Preço Base</span>
                  <span>€{state.quotation.breakdown.basePrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Ajuste de Peso</span>
                  <span>€{state.quotation.breakdown.weightPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Distância</span>
                  <span>{state.distance.toFixed(1)} km</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center py-4 mb-6">
                <p className="text-lg font-medium text-gray-800">
                  O preço do seu orçamento será calculado e enviado por email
                </p>
              </div>
              <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">Detalhes da Sua Encomenda:</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Origem:</span>
                    <span>{formData.startLocation}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Destino:</span>
                    <span>{formData.endLocation}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Peso:</span>
                    <span>{formData.weight} kg</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Volumes:</span>
                    <span>{formData.volumes}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Dimensões:</span>
                    <span>{formData.dimensions.length} x {formData.dimensions.width} x {formData.dimensions.height} cm</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-600">Distância:</span>
                    <span>{state.distance?.toFixed(1)} km</span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <input
                type="text"
                value={formData.clientName}
                onChange={e => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="Introduza o seu nome"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={e => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="Introduza o seu email"
                required
              />
            </div>

            <button
              type="button"
              className="w-full bg-green-600 text-white p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
              onClick={handleFinalSubmit}
            >
              Enviar Pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotation;
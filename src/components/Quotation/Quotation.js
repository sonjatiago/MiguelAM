import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { MapPin, Package, Send, Plane } from 'lucide-react';
import debounce from 'lodash/debounce';

const PRICE_CONFIG = {
  aviao: { baseRate: 2, weightFactor: 1 },
  carrinha: {
    types: [
      {
        id: 'ligeira',
        name: 'Carrinha Comercial Ligeira',
        example: '2 europaletes',
        maxWeight: 600,
        maxVolume: 2000000,
        dimensions: { height: 100, width: 120, length: 180 },
        pricePerKm: 0.40
      },
      {
        id: 'furgao',
        name: 'Carrinha Furgão',
        example: '5 europaletes',
        maxWeight: 1200,
        maxVolume: 13000000,
        dimensions: { height: 170, width: 120, length: 300 },
        pricePerKm: 0.60
      },
      {
        id: 'furgaoGrande',
        name: 'Furgão com contentor de bascula',
        example: '9 europaletes',
        maxWeight: 1000,
        maxVolume: 20000000,
        dimensions: { height: 220, width: 200, length: 480 },
        pricePerKm: 0.90
      }
    ]
  }
};

const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = value => (value * Math.PI) / 180;

const LocationInput = ({ label, value, suggestions, onChange, onSelect, error }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (value === '') {
      setInputValue('');
      setSelectedValue('');
    }
  }, [value]);

  useEffect(() => {
    if (error) {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

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
          ref={inputRef}
          type="text"
          value={selectedValue || inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
          className={`w-full p-2 border rounded-lg ${error ? 'border-red-500' : ''}`}
          placeholder={`Introduza ${label.toLowerCase()}`}
          required
        />
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg max-h-48 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onMouseDown={() => handleSuggestionClick(suggestion)}
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

  const [fieldErrors, setFieldErrors] = useState({});
  
  const [state, setState] = useState({
    quotation: null,
    distance: null,
    loading: false,
    isCalculated: false,
    showSuccess: false
  });

  const [suggestions, setSuggestions] = useState({
    start: [],
    end: []
  });

    // Add this new useEffect
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    
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
      setFieldErrors(prev => ({
        ...prev,
        [type === 'start' ? 'startLocation' : 'endLocation']: 'Falha ao obter sugestões de endereço'
      }));
    }
  }, [apiKey]);

  const debouncedSearch = useMemo(() => ({
    start: debounce(q => getAddressSuggestions(q, 'start'), 300),
    end: debounce(q => getAddressSuggestions(q, 'end'), 300)
  }), [getAddressSuggestions]);

  const calculatePrice = useCallback((distance, serviceType, weight, dimensions, volumes) => {
    if (serviceType === 'aviao') return null;
    
    const errors = {};
    
    if (!weight) errors.weight = 'Por favor, introduza o peso';
    if (!volumes) errors.volumes = 'Por favor, introduza o número de volumes';
    if (!dimensions.length || !dimensions.width || !dimensions.height) {
      errors.dimensions = 'Por favor, preencha todas as dimensões';
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      throw new Error('Validation failed');
    }
    
    const config = PRICE_CONFIG[serviceType];
    
    const singleVolume = dimensions.length * dimensions.width * dimensions.height;
    const totalVolume = singleVolume * volumes;
    
    if (weight <= 0) {
      setFieldErrors({ weight: 'O peso deve ser maior que zero' });
      throw new Error('Validation failed');
    }
    if (singleVolume <= 0) {
      setFieldErrors({ dimensions: 'As dimensões devem ser maiores que zero' });
      throw new Error('Validation failed');
    }
    if (volumes <= 0) {
      setFieldErrors({ volumes: 'O número de volumes deve ser maior que zero' });
      throw new Error('Validation failed');
    }

    const appropriateVan = config.types.find(type => 
      weight <= type.maxWeight && totalVolume <= type.maxVolume
    );
    
    if (!appropriateVan) {
      if (weight > config.types[2].maxWeight) {
        setFieldErrors({ weight: 'Peso excede o limite máximo permitido' });
      }
      if (totalVolume > config.types[2].maxVolume) {
        setFieldErrors({ 
          volumes: 'Volume total excede o limite máximo permitido',
          dimensions: 'Volume total excede o limite máximo permitido'
        });
      }
      throw new Error('Validation failed');
    }
    
    setFieldErrors({});
    
    const roundTripDistance = distance * 2;
    const totalPrice = appropriateVan.pricePerKm * roundTripDistance;
    
    return {
      totalPrice,
      breakdown: { 
        pricePerKm: appropriateVan.pricePerKm,
        roundTripDistance,
        oneWayDistance: distance,
        vanType: {
          name: appropriateVan.name,
          example: appropriateVan.example,
          dimensions: appropriateVan.dimensions
        },
        singleVolume,
        totalVolume,
        volumes
      }
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
    setState(prev => ({ 
      ...prev, 
      isCalculated: false, 
      quotation: null,
      showSuccess: false 
    }));
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    setFieldErrors({});
    setState(prev => ({ ...prev, loading: true }));

    try {
      const startCoords = suggestions.start[0]?.geometry;
      const endCoords = suggestions.end[0]?.geometry;
      
      if (!startCoords) {
        setFieldErrors(prev => ({ ...prev, startLocation: 'Por favor, selecione um endereço válido das sugestões' }));
        throw new Error('Validation failed');
      }
      
      if (!endCoords) {
        setFieldErrors(prev => ({ ...prev, endLocation: 'Por favor, selecione um endereço válido das sugestões' }));
        throw new Error('Validation failed');
      }

      const distance = calculateHaversineDistance(
        startCoords.lat,
        startCoords.lng,
        endCoords.lat,
        endCoords.lng
      );

      const weight = parseFloat(formData.weight) || 0;
      const volumes = parseFloat(formData.volumes) || 0;
      const dimensions = {
        length: parseFloat(formData.dimensions.length) || 0,
        width: parseFloat(formData.dimensions.width) || 0,
        height: parseFloat(formData.dimensions.height) || 0
      };

      const quotation = calculatePrice(
        distance,
        formData.serviceType,
        weight,
        dimensions,
        volumes
      );

      setState(prev => ({
        ...prev,
        distance,
        quotation,
        isCalculated: true,
        loading: false
      }));

      if (summaryRef.current) {
        summaryRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false
      }));
    }
  };

  const handleFinalSubmit = () => {
    const errors = {};
    if (!formData.clientName) {
      errors.clientName = 'Por favor, preencha seu nome';
    }
    if (!formData.clientEmail) {
      errors.clientEmail = 'Por favor, preencha seu email';
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    console.log('Form submitted:', formData);
    setState(prev => ({ ...prev, showSuccess: true }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Obter Cotação</h2>
        <p className="text-gray-600">Calcule os custos de envio instantaneamente</p>
      </div>

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
            error={fieldErrors.startLocation}
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
            error={fieldErrors.endLocation}
          />

          {(formData.serviceType === 'carrinha' || formData.serviceType === 'aviao') && (
            <div className="space-y-6">
              <div ref={fieldErrors.weight ? undefined : null} className="space-y-2">
                <label className="text-sm font-medium">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={e => {
                    setFieldErrors(prev => ({ ...prev, weight: null }));
                    setFormData(prev => ({ ...prev, weight: e.target.value }));
                  }}
                  className={`w-full p-2 border rounded-lg ${
                    fieldErrors.weight ? 'border-red-500' : ''
                  }`}
                  placeholder="Introduza o peso"
                  required
                />
                {fieldErrors.weight && (
                  <p className="text-sm text-red-500">{fieldErrors.weight}</p>
                )}
              </div>

              <div ref={fieldErrors.volumes ? undefined : null} className="space-y-2">
                <label className="text-sm font-medium">
                  Número de Volumes
                </label>
                <input
                  type="number"
                  value={formData.volumes}
                  onChange={e => {
                    setFieldErrors(prev => ({ ...prev, volumes: null }));
                    setFormData(prev => ({ ...prev, volumes: e.target.value }));
                  }}
                  className={`w-full p-2 border rounded-lg ${
                    fieldErrors.volumes ? 'border-red-500' : ''
                  }`}
                  placeholder="Introduza o número de volumes"
                  required
                />
                {fieldErrors.volumes && (
                  <p className="text-sm text-red-500">{fieldErrors.volumes}</p>
                )}
              </div>

              <div ref={fieldErrors.dimensions ? undefined : null} className="space-y-2">
                <label className="text-sm font-medium">
                  Dimensões (cm)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    value={formData.dimensions.length}
                    onChange={e => {
                      setFieldErrors(prev => ({ ...prev, dimensions: null }));
                      setFormData(prev => ({
                        ...prev,
                        dimensions: { ...prev.dimensions, length: e.target.value }
                      }));
                    }}
                    className={`w-full p-2 border rounded-lg ${
                      fieldErrors.dimensions ? 'border-red-500' : ''
                    }`}
                    placeholder="Comprimento"
                    required
                  />
                  <input
                    type="number"
                    value={formData.dimensions.width}
                    onChange={e => {
                      setFieldErrors(prev => ({ ...prev, dimensions: null }));
                      setFormData(prev => ({
                        ...prev,
                        dimensions: { ...prev.dimensions, width: e.target.value }
                      }));
                    }}
                    className={`w-full p-2 border rounded-lg ${
                      fieldErrors.dimensions ? 'border-red-500' : ''
                    }`}
                    placeholder="Largura"
                    required
                  />
                  <input
                    type="number"
                    value={formData.dimensions.height}
                    onChange={e => {
                      setFieldErrors(prev => ({ ...prev, dimensions: null }));
                      setFormData(prev => ({
                        ...prev,
                        dimensions: { ...prev.dimensions, height: e.target.value }
                      }));
                    }}
                    className={`w-full p-2 border rounded-lg ${
                      fieldErrors.dimensions ? 'border-red-500' : ''
                    }`}
                    placeholder="Altura"
                    required
                  />
                </div>
                {fieldErrors.dimensions && (
                  <p className="text-sm text-red-500">{fieldErrors.dimensions}</p>
                )}
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
                <div className="text-sm text-gray-600">Preço Total (ida e volta)</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tipo de Veículo</span>
                  <span>{state.quotation.breakdown.vanType.name}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Dimensões máximas (cm)</span>
                  <span>
                    {state.quotation.breakdown.vanType.dimensions.length} x{' '}
                    {state.quotation.breakdown.vanType.dimensions.width} x{' '}
                    {state.quotation.breakdown.vanType.dimensions.height}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Volume por Unidade</span>
                  <span>
                    {state.quotation.breakdown.singleVolume.toLocaleString()} cm³ 
                    ({(state.quotation.breakdown.singleVolume / 1000000).toFixed(2)} m³)
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Número de Volumes</span>
                  <span>{state.quotation.breakdown.volumes}</span>
                </div>
                
                <div className="flex justify-between text-sm font-medium">
                  <span>Volume Total</span>
                  <span>
                    {state.quotation.breakdown.totalVolume.toLocaleString()} cm³ 
                    ({(state.quotation.breakdown.totalVolume / 1000000).toFixed(2)} m³)
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Preço por km</span>
                  <span>€{state.quotation.breakdown.pricePerKm.toFixed(2)}/km</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Distância (ida)</span>
                  <span>{state.quotation.breakdown.oneWayDistance.toFixed(1)} km</span>
                </div>
                
                <div className="flex justify-between text-sm font-medium">
                  <span>Distância Total (ida e volta)</span>
                  <span>{state.quotation.breakdown.roundTripDistance.toFixed(1)} km</span>
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
                className={`w-full p-2 border rounded-lg ${
                  fieldErrors.clientName ? 'border-red-500' : ''
                }`}
                placeholder="Introduza o seu nome"
                required
              />
              {fieldErrors.clientName && (
                <p className="text-sm text-red-500">{fieldErrors.clientName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={e => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                className={`w-full p-2 border rounded-lg ${
                  fieldErrors.clientEmail ? 'border-red-500' : ''
                }`}
                placeholder="Introduza o seu email"
                required
              />
              {fieldErrors.clientEmail && (
                <p className="text-sm text-red-500">{fieldErrors.clientEmail}</p>
              )}
            </div>

            <button
              type="button"
              className="w-full bg-green-600 text-white p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
              onClick={handleFinalSubmit}
            >
              Enviar Pedido
            </button>

            {state.showSuccess && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-center">
                  O seu pedido de orçamento foi feito com sucesso. A nossa equipa está a trabalhar para lhe dar uma resposta o mais breve possível.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotation;
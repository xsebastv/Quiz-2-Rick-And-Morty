import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LocationService from '../services/LocationService.js';
import CharacterService from '../services/CharacterService.js';
import imagesData from '../data/images.json';
import './LocationDetailView.css';

const LocationDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLocationDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const locationData = await LocationService.getLocationById(id);
        setLocation(locationData);

        // Cargar residentes si los hay
        if (locationData.residents.length > 0) {
          const residentIds = locationData.residents.map(url => {
            const parts = url.split('/');
            return parts[parts.length - 1];
          });
          
          const residentsData = await CharacterService.getMultipleCharacters(residentIds.slice(0, 10));
          setResidents(Array.isArray(residentsData) ? residentsData : [residentsData]);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading location detail:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLocationDetail();
  }, [id]);

  const getLocationImage = (location) => {
    // Buscar primero en el JSON de imágenes
    const locationData = imagesData.locations.find(loc => loc.id === parseInt(id));
    if (locationData?.image) {
      return locationData.image;
    }
    
    // Si no se encuentra en el JSON, usar un mapa de tipos de ubicación
    const imageMap = {
      'Planet': 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80',
      'Space station': 'https://images.unsplash.com/photo-1483519076816-80a45b5b92c5?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80',
      'Cluster': 'https://images.unsplash.com/photo-1526193292066-11b65af81bb7?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80',
      'TV': 'https://images.unsplash.com/photo-1585229260487-3f296c851c16?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80',
      'Dream': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80',
      'Dimension': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80',
      'unknown': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80'
    };
    
    return imageMap[location.type] || imageMap['Planet'];
  };

  if (loading) {
    return (
      <div className="location-detail-view">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Cargando información de la ubicación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="location-detail-view">
        <div className="error">
          <p>❌ Error: {error}</p>
          <button onClick={() => navigate('/locations')} className="back-button">
            Volver a ubicaciones
          </button>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="location-detail-view">
        <div className="error">
          <p>❌ Ubicación no encontrada</p>
          <button onClick={() => navigate('/locations')} className="back-button">
            Volver a ubicaciones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="location-detail-view">
      <button onClick={() => navigate('/locations')} className="back-button">
        ← Volver a ubicaciones
      </button>
      
      <div className="location-hero">
        <img 
          src={getLocationImage(location)} 
          alt={location.name}
          className="location-hero-image"
        />
        <div className="location-hero-overlay">
          <h1 className="location-title">{location.name}</h1>
          <span className="location-type-badge">{location.type}</span>
        </div>
      </div>

      <div className="location-content">
        <div className="location-info-grid">
          <div className="info-card">
            <h3>📍 Información General</h3>
            <div className="info-item">
              <strong>Nombre:</strong> {location.name}
            </div>
            <div className="info-item">
              <strong>Tipo:</strong> {location.type}
            </div>
            <div className="info-item">
              <strong>Dimensión:</strong> {location.getDimensionInfo()}
            </div>
            <div className="info-item">
              <strong>Estado:</strong> {location.hasResidents() ? 'Habitada' : 'Deshabitada'}
            </div>
            <div className="info-item">
              <strong>ID:</strong> #{location.id}
            </div>
            <div className="info-item">
              <strong>Creado:</strong> {location.getFormattedCreatedDate()}
            </div>
          </div>

          <div className="info-card">
            <h3>👥 Residentes ({location.getResidentsCount()})</h3>
            {residents.length > 0 ? (
              <div className="residents-grid">
                {residents.map(resident => (
                  <div key={resident.id} className="resident-card">
                    <img src={resident.image} alt={resident.name} className="resident-image" />
                    <div className="resident-info">
                      <h4>{resident.name}</h4>
                      <p>{resident.species}</p>
                    </div>
                  </div>
                ))}
                {location.getResidentsCount() > 10 && (
                  <p className="residents-note">
                    Mostrando solo los primeros 10 de {location.getResidentsCount()} residentes
                  </p>
                )}
              </div>
            ) : (
              <p>Esta ubicación no tiene residentes conocidos</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetailView;
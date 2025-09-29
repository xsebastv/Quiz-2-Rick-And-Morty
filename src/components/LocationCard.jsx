import { useNavigate } from 'react-router-dom';
import './LocationCard.css';

const LocationCard = ({ location }) => {
  const navigate = useNavigate();

  // Función para generar imagen basada en el tipo de ubicación
  const getLocationImage = (locationType, locationName) => {
    const imageMap = {
      'Planet': 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=200&fit=crop&crop=entropy&auto=format&q=60',
      'Space station': 'https://images.unsplash.com/photo-1483519076816-80a45b5b92c5?w=400&h=200&fit=crop&crop=entropy&auto=format&q=60',
      'Cluster': 'https://images.unsplash.com/photo-1526193292066-11b65af81bb7?w=400&h=200&fit=crop&crop=entropy&auto=format&q=60',
      'TV': 'https://images.unsplash.com/photo-1585229260487-3f296c851c16?w=400&h=200&fit=crop&crop=entropy&auto=format&q=60',
      'Dream': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=200&fit=crop&crop=entropy&auto=format&q=60',
      'Dimension': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=200&fit=crop&crop=entropy&auto=format&q=60',
      'unknown': 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=200&fit=crop&crop=entropy&auto=format&q=60'
    };
    
    return imageMap[locationType] || imageMap['Planet'];
  };

  const handleClick = () => {
    navigate(`/locations/${location.id}`);
  };

  return (
    <div className="location-card" onClick={handleClick}>
      <img 
        src={getLocationImage(location.type, location.name)} 
        alt={location.name}
        className="location-image"
      />
      <div className="location-content">
        <div className="location-header">
          <h3 className="location-name">{location.name}</h3>
          <span className="location-type">{location.type}</span>
        </div>
        <div className="location-info">
          <p className="location-dimension">
            <strong>Dimensión:</strong> {location.getDimensionInfo()}
          </p>
          <p className="location-residents">
            <strong>Residentes:</strong> {location.getResidentsCount()} personajes
          </p>
          <p className="location-status">
            <strong>Estado:</strong> {location.hasResidents() ? 'Habitada' : 'Deshabitada'}
          </p>
          <div className="location-meta">
            <span className="location-id">ID: {location.id}</span>
            <span className="location-date">{location.getFormattedCreatedDate()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
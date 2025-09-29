import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CharacterService from '../services/CharacterService.js';
import EpisodeService from '../services/EpisodeService.js';
import LocationService from '../services/LocationService.js';
import imagesData from '../data/images.json';
import './CharacterDetailView.css';

const CharacterDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [character, setCharacter] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [episodesBySeasons, setEpisodesBySeasons] = useState({});
  const [location, setLocation] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacterData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch character data
        const characterData = await CharacterService.getCharacterById(id);
        // characterData ya es una instancia de Character del servicio
        setCharacter(characterData);

        // Fetch episodes data
        if (characterData.episode && characterData.episode.length > 0) {
          const episodeIds = characterData.episode.map(url => {
            const match = url.match(/\/(\d+)$/);
            return match ? match[1] : null;
          }).filter(Boolean);

          const episodesData = await EpisodeService.getMultipleEpisodes(episodeIds);
          // episodesData ya son instancias de Episode, no necesitamos crear nuevas
          setEpisodes(episodesData);

          // Agrupar episodios por temporada
          const seasons = {};
          episodesData.forEach(episode => {
            const seasonMatch = episode.episode.match(/S(\d+)/);
            const season = seasonMatch ? parseInt(seasonMatch[1]) : 1;
            if (!seasons[season]) {
              seasons[season] = [];
            }
            seasons[season].push(episode);
          });

          // Ordenar episodios dentro de cada temporada
          Object.keys(seasons).forEach(season => {
            seasons[season].sort((a, b) => {
              const aEpisode = parseInt(a.episode.match(/E(\d+)/)?.[1] || 0);
              const bEpisode = parseInt(b.episode.match(/E(\d+)/)?.[1] || 0);
              return aEpisode - bEpisode;
            });
          });

          setEpisodesBySeasons(seasons);
        }

        // Fetch location data
        if (characterData.location && characterData.location.url) {
          const locationMatch = characterData.location.url.match(/\/(\d+)$/);
          if (locationMatch) {
            const locationData = await LocationService.getLocationById(locationMatch[1]);
            // locationData ya es una instancia de Location del servicio
            setLocation(locationData);
          }
        }

        // Fetch origin data
        if (characterData.origin && characterData.origin.url) {
          const originMatch = characterData.origin.url.match(/\/(\d+)$/);
          if (originMatch) {
            const originData = await LocationService.getLocationById(originMatch[1]);
            // originData ya es una instancia de Location del servicio
            setOrigin(originData);
          }
        }

      } catch (err) {
        console.error('Error fetching character data:', err);
        setError('Error al cargar los datos del personaje');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCharacterData();
    }
  }, [id]);

  const generateCharacterImage = (character) => {
    if (character.image) return character.image;
    return `https://images.unsplash.com/400x400/?random=${character.id}&sci-fi`;
  };

  const getRealEpisodeImage = (episode) => {
    // Usar el JSON de imágenes para obtener la imagen correcta
    const episodeData = imagesData.episodes.find(ep => ep.id === episode.id);
    return episodeData?.image || 
           'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=400&fit=crop&q=80&auto=format&blend=70249f&sat=-100&exp=15&usm=12&bg=131417';
  };

  const getLocationImage = (location) => {
    // Usar el JSON de imágenes para obtener la imagen correcta
    const locationData = imagesData.locations.find(loc => loc.id === location.id);
    if (locationData?.image) {
      return locationData.image;
    }
    
    // Imagen fallback si no se encuentra en el JSON
    const keywords = ['alien-world', 'planet', 'space', 'dimension'];
    const keyword = keywords[location.id % keywords.length];
    return `https://rickandmortyapi.com/api/location/avatar/${location.id}.jpeg` || 
           `https://images.unsplash.com/600x300/?random=${location.id}&${keyword}`;
  };

  const handleEpisodeClick = (episodeId) => {
    navigate(`/episodes/${episodeId}`);
  };

  const handleLocationClick = (locationId) => {
    navigate(`/locations/${locationId}`);
  };

  if (loading) {
    return (
      <div className="character-detail-view">
        <div className="loading">
          <div className="loading-spinner"></div>
          <h3>Cargando personaje...</h3>
          <p>Obteniendo información detallada</p>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="character-detail-view">
        <div className="error">
          <h3>¡Oops! Algo salió mal</h3>
          <p>{error || 'No se pudo encontrar el personaje'}</p>
          <button 
            className="back-button" 
            onClick={() => navigate('/characters')}
          >
            ← Volver a Personajes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="character-detail-view">
      <button 
        className="back-button" 
        onClick={() => navigate('/characters')}
      >
        ← Volver a Personajes
      </button>

      <div className="character-hero">
        <img 
          src={generateCharacterImage(character)} 
          alt={character.name}
          className="character-hero-image"
        />
        <div className="character-hero-overlay">
          <div className="character-hero-content">
            <h1 className="character-title">{character.name}</h1>
            <div className="character-status-badge">
              <span 
                className="status-indicator" 
                style={{backgroundColor: character.getStatusColor()}}
              >
                {character.status}
              </span>
              <span className="character-species">{character.species}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="character-content">
        <div className="character-info-grid">
          {/* Character Basic Info */}
          <div className="info-card">
            <h3>📋 Información Básica</h3>
            <div className="info-item">
              <strong>Nombre:</strong> {character.name}
            </div>
            <div className="info-item">
              <strong>Estado:</strong> 
              <span 
                className="status-indicator small" 
                style={{backgroundColor: character.getStatusColor()}}
              >
                {character.status}
              </span>
            </div>
            <div className="info-item">
              <strong>Especie:</strong> {character.species}
            </div>
            <div className="info-item">
              <strong>Tipo:</strong> {character.type || 'Desconocido'}
            </div>
            <div className="info-item">
              <strong>Género:</strong> {character.gender}
            </div>
            <div className="info-item">
              <strong>Creado:</strong> {character.getFormattedCreatedDate()}
            </div>
          </div>

          {/* Location Information */}
          <div className="info-card">
            <h3>🌍 Ubicaciones</h3>
            
            {origin ? (
              <div className="location-info" onClick={() => handleLocationClick(origin.id)}>
                <h4>Origen</h4>
                <div className="location-card">
                  <img 
                    src={getLocationImage(origin)} 
                    alt={origin.name}
                    className="location-mini-image"
                  />
                  <div>
                    <strong>{origin.name}</strong>
                    <p>{origin.type} - {origin.dimension}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="info-item">
                <strong>Origen:</strong> {character.origin?.name || 'Desconocido'}
              </div>
            )}

            {location ? (
              <div className="location-info" onClick={() => handleLocationClick(location.id)}>
                <h4>Ubicación Actual</h4>
                <div className="location-card">
                  <img 
                    src={getLocationImage(location)} 
                    alt={location.name}
                    className="location-mini-image"
                  />
                  <div>
                    <strong>{location.name}</strong>
                    <p>{location.type} - {location.dimension}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="info-item">
                <strong>Ubicación Actual:</strong> {character.location?.name || 'Desconocida'}
              </div>
            )}
          </div>
        </div>

        {/* Episodes Section - Organized by Seasons */}
        {episodes.length > 0 && (
          <div className="episodes-section">
            <h2>📺 Episodios por Temporada ({episodes.length} total)</h2>
            <div className="seasons-container">
              {Object.keys(episodesBySeasons)
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map(season => (
                  <div key={season} className="season-card">
                    <h3 className="season-title">
                      Temporada {season}
                      <span className="episode-count">
                        {episodesBySeasons[season].length} episodios
                      </span>
                    </h3>
                    <div className="episodes-grid">
                      {episodesBySeasons[season].map(episode => (
                        <div 
                          key={episode.id} 
                          className="episode-item"
                          onClick={() => navigate(`/episodes/${episode.id}`)}
                        >
                          <img 
                            src={getRealEpisodeImage(episode)}
                            alt={episode.name}
                            className="episode-thumbnail"
                          />
                          <div className="episode-info">
                            <span className="episode-code">{episode.episode}</span>
                            <h4 className="episode-title">{episode.name}</h4>
                            <p className="episode-date">{episode.getFormattedAirDate()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterDetailView;
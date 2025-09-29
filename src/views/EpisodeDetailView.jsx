import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EpisodeService from '../services/EpisodeService.js';
import CharacterService from '../services/CharacterService.js';
import imagesData from '../data/images.json';
import './EpisodeDetailView.css';

const EpisodeDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEpisodeDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const episodeData = await EpisodeService.getEpisodeById(id);
        setEpisode(episodeData);

        // Cargar personajes del episodio
        if (episodeData.characters.length > 0) {
          const characterIds = episodeData.characters.map(url => {
            const parts = url.split('/');
            return parts[parts.length - 1];
          });
          
          const charactersData = await CharacterService.getMultipleCharacters(characterIds.slice(0, 12));
          setCharacters(Array.isArray(charactersData) ? charactersData : [charactersData]);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading episode detail:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEpisodeDetail();
  }, [id]);

  const getEpisodeImage = (episodeId) => {
    const episodeData = imagesData.episodes.find(ep => ep.id === episodeId);
    return episodeData?.image || 
           'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&h=400&fit=crop&crop=entropy&auto=format&q=80';
  };

  if (loading) {
    return (
      <div className="episode-detail-view">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Cargando información del episodio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="episode-detail-view">
        <div className="error">
          <p>❌ Error: {error}</p>
          <button onClick={() => navigate('/episodes')} className="back-button">
            Volver a episodios
          </button>
        </div>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="episode-detail-view">
        <div className="error">
          <p>❌ Episodio no encontrado</p>
          <button onClick={() => navigate('/episodes')} className="back-button">
            Volver a episodios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="episode-detail-view">
      <button onClick={() => navigate('/episodes')} className="back-button">
        ← Volver a episodios
      </button>
      
      <div className="episode-hero">
        <img 
          src={getEpisodeImage(episode.id)} 
          alt={episode.name}
          className="episode-hero-image"
        />
        <div className="episode-hero-overlay">
          <h1 className="episode-title">{episode.name}</h1>
          <span className="episode-code-badge">{episode.episode}</span>
        </div>
      </div>

      <div className="episode-content">
        <div className="episode-info-grid">
          <div className="info-card">
            <h3>📺 Información del Episodio</h3>
            <div className="info-item">
              <strong>Título:</strong> {episode.name}
            </div>
            <div className="info-item">
              <strong>Código:</strong> {episode.episode}
            </div>
            <div className="info-item">
              <strong>Temporada:</strong> {episode.getFormattedEpisodeCode()}
            </div>
            <div className="info-item">
              <strong>Fecha de emisión:</strong> {episode.airDate}
            </div>
            <div className="info-item">
              <strong>Personajes:</strong> {episode.getCharactersCount()} apariciones
            </div>
            <div className="info-item">
              <strong>ID:</strong> #{episode.id}
            </div>
            <div className="info-item">
              <strong>Creado:</strong> {episode.getFormattedCreatedDate()}
            </div>
          </div>

          <div className="info-card">
            <h3>🎭 Personajes ({episode.getCharactersCount()})</h3>
            {characters.length > 0 ? (
              <div className="characters-grid">
                {characters.map(character => (
                  <div key={character.id} className="character-card">
                    <img src={character.image} alt={character.name} className="character-image" />
                    <div className="character-info">
                      <h4>{character.name}</h4>
                      <p>{character.species}</p>
                      <span 
                        className="status-indicator"
                        style={{ backgroundColor: character.getStatusColor() }}
                      >
                        {character.status}
                      </span>
                    </div>
                  </div>
                ))}
                {episode.getCharactersCount() > 12 && (
                  <p className="characters-note">
                    Mostrando solo los primeros 12 de {episode.getCharactersCount()} personajes
                  </p>
                )}
              </div>
            ) : (
              <p>No se pudieron cargar los personajes de este episodio</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeDetailView;
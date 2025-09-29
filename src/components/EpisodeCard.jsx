import { useNavigate } from 'react-router-dom';
import imagesData from '../data/images.json';
import './EpisodeCard.css';

const EpisodeCard = ({ episode }) => {
  const navigate = useNavigate();

  // Función para generar imagen basada en el episodio usando el JSON
  const getEpisodeImage = (episodeId) => {
    const episodeData = imagesData.episodes.find(ep => ep.id === episodeId);
    return episodeData?.image || 
           'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=200&fit=crop&crop=entropy&auto=format&q=60';
  };

  const handleClick = () => {
    navigate(`/episodes/${episode.id}`);
  };

  return (
    <div className="episode-card" onClick={handleClick}>
      <img 
        src={getEpisodeImage(episode.id)} 
        alt={episode.name}
        className="episode-image"
      />
      <div className="episode-content">
        <div className="episode-header">
          <h3 className="episode-name">{episode.name}</h3>
          <span className="episode-code">{episode.episode}</span>
        </div>
        <div className="episode-info">
          <p className="episode-season-info">
            <strong>Info:</strong> {episode.getFormattedEpisodeCode()}
          </p>
          <p className="episode-air-date">
            <strong>Fecha de emisión:</strong> {episode.airDate}
          </p>
          <p className="episode-characters">
            <strong>Personajes:</strong> {episode.getCharactersCount()} apariciones
          </p>
          <div className="episode-meta">
            <span className="episode-id">ID: {episode.id}</span>
            <span className="episode-created">{episode.getFormattedCreatedDate()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeCard;
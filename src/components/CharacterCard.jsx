import { useNavigate } from 'react-router-dom';
import './CharacterCard.css';

const CharacterCard = ({ character }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/characters/${character.id}`);
  };

  return (
    <div className="character-card" onClick={handleClick}>
      <img 
        src={character.image} 
        alt={character.name}
        className="character-image"
      />
      <div className="character-info">
        <h3 className="character-name">{character.name}</h3>
        <div className="character-details">
          <div className="status-container">
            <span 
              className="status-indicator"
              style={{ backgroundColor: character.getStatusColor() }}
            ></span>
            <span className="status-text">{character.status}</span>
          </div>
          <p className="character-species">
            <strong>Especie:</strong> {character.species}
          </p>
          <p className="character-gender">
            <strong>Género:</strong> {character.gender}
          </p>
          {character.origin && (
            <p className="character-origin">
              <strong>Origen:</strong> {character.origin.name}
            </p>
          )}
          <p className="character-created">
            <strong>Creado:</strong> {character.getFormattedCreatedDate()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
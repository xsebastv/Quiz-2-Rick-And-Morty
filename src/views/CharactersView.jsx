import { useState, useEffect } from 'react';
import CharacterController from '../controllers/CharacterController.js';
import CharacterCard from '../components/CharacterCard.jsx';
import './CharactersView.css';

const CharactersView = () => {
  const [controller] = useState(new CharacterController());
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const data = await controller.loadCharacters();
        setCharacters(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error loading characters:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCharacters();
  }, [controller]);

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await controller.loadCharacters();
      setCharacters(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="characters-view">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Cargando personajes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="characters-view">
        <div className="error">
          <p>❌ Error: {error}</p>
          <button onClick={handleRetry} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="characters-view">
      <div className="view-header">
        <h2>Personajes Principales</h2>
        <p>Los primeros 5 personajes de Rick and Morty</p>
      </div>
      <div className="characters-grid">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
};

export default CharactersView;
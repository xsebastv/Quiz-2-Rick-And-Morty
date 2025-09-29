import { useState, useEffect, useCallback } from 'react';
import EpisodeService from '../services/EpisodeService.js';
import EpisodeCard from '../components/EpisodeCard.jsx';
import useInfiniteScroll from '../hooks/useInfiniteScroll.js';
import './EpisodesView.css';

const EpisodesView = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const loadInitialEpisodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await EpisodeService.getWithPagination(1);
      setEpisodes(data.episodes);
      setCurrentPage(1);
      setHasNextPage(data.hasNextPage);
      setTotalCount(data.info.count);
    } catch (err) {
      setError(err.message);
      console.error('Error loading episodes:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreEpisodes = useCallback(async () => {
    if (!hasNextPage) return Promise.resolve();
    
    try {
      const nextPage = currentPage + 1;
      const data = await EpisodeService.getWithPagination(nextPage);
      setEpisodes(prev => [...prev, ...data.episodes]);
      setCurrentPage(nextPage);
      setHasNextPage(data.hasNextPage);
      return Promise.resolve();
    } catch (err) {
      console.error('Error loading more episodes:', err);
      return Promise.resolve();
    }
  }, [currentPage, hasNextPage]);

  const { loading: loadingMore } = useInfiniteScroll(loadMoreEpisodes, hasNextPage);

  useEffect(() => {
    loadInitialEpisodes();
  }, []);

  const handleRetry = () => {
    loadInitialEpisodes();
  };

  if (loading) {
    return (
      <div className="episodes-view">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Cargando episodios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="episodes-view">
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
    <div className="episodes-view">
      <div className="view-header">
        <h2>Episodios de la Serie</h2>
        <p>
          {episodes.length} de {totalCount} episodios cargados
          {hasNextPage && ' (scroll para cargar más)'}
        </p>
      </div>
      <div className="episodes-list">
        {episodes.map((episode) => (
          <EpisodeCard key={episode.id} episode={episode} />
        ))}
      </div>
      {loadingMore && (
        <div className="loading-more">
          <div className="loading-spinner"></div>
          <p>Cargando más episodios...</p>
        </div>
      )}
    </div>
  );
};

export default EpisodesView;
import { useState, useEffect, useCallback } from 'react';
import LocationService from '../services/LocationService.js';
import LocationCard from '../components/LocationCard.jsx';
import useInfiniteScroll from '../hooks/useInfiniteScroll.js';
import './LocationsView.css';

const LocationsView = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const loadInitialLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await LocationService.getWithPagination(1);
      setLocations(data.locations);
      setCurrentPage(1);
      setHasNextPage(data.hasNextPage);
      setTotalCount(data.info.count);
    } catch (err) {
      setError(err.message);
      console.error('Error loading locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreLocations = useCallback(async () => {
    if (!hasNextPage) return Promise.resolve();
    
    try {
      const nextPage = currentPage + 1;
      const data = await LocationService.getWithPagination(nextPage);
      setLocations(prev => [...prev, ...data.locations]);
      setCurrentPage(nextPage);
      setHasNextPage(data.hasNextPage);
      return Promise.resolve();
    } catch (err) {
      console.error('Error loading more locations:', err);
      return Promise.resolve();
    }
  }, [currentPage, hasNextPage]);

  const { loading: loadingMore } = useInfiniteScroll(loadMoreLocations, hasNextPage);

  useEffect(() => {
    loadInitialLocations();
  }, []);

  const handleRetry = () => {
    loadInitialLocations();
  };

  if (loading) {
    return (
      <div className="locations-view">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Cargando ubicaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="locations-view">
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
    <div className="locations-view">
      <div className="view-header">
        <h2>Ubicaciones del Multiverso</h2>
        <p>
          {locations.length} de {totalCount} ubicaciones cargadas
          {hasNextPage && ' (scroll para cargar más)'}
        </p>
      </div>
      <div className="locations-list">
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
      {loadingMore && (
        <div className="loading-more">
          <div className="loading-spinner"></div>
          <p>Cargando más ubicaciones...</p>
        </div>
      )}
    </div>
  );
};

export default LocationsView;
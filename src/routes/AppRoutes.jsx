import { Routes, Route } from 'react-router-dom';
import CharactersView from '../views/CharactersView.jsx';
import LocationsView from '../views/LocationsView.jsx';
import EpisodesView from '../views/EpisodesView.jsx';
import CharacterDetailView from '../views/CharacterDetailView.jsx';
import LocationDetailView from '../views/LocationDetailView.jsx';
import EpisodeDetailView from '../views/EpisodeDetailView.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CharactersView />} />
      <Route path="/characters" element={<CharactersView />} />
      <Route path="/characters/:id" element={<CharacterDetailView />} />
      <Route path="/locations" element={<LocationsView />} />
      <Route path="/locations/:id" element={<LocationDetailView />} />
      <Route path="/episodes" element={<EpisodesView />} />
      <Route path="/episodes/:id" element={<EpisodeDetailView />} />
      <Route path="*" element={<CharactersView />} />
    </Routes>
  );
};

export default AppRoutes;
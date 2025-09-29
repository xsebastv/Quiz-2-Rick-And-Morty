import EpisodeService from '../services/EpisodeService.js';

class EpisodeController {
  constructor() {
    this.episodes = [];
    this.loading = false;
    this.error = null;
    this.info = null;
  }

  async loadEpisodes() {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const data = await EpisodeService.getFirstFive();
      this.episodes = data.results;
      this.info = data.info;
      
      return this.episodes;
    } catch (error) {
      this.setError(error.message);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async loadEpisodeById(id) {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const episode = await EpisodeService.getEpisodeById(id);
      return episode;
    } catch (error) {
      this.setError(error.message);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    this.loading = loading;
  }

  setError(error) {
    this.error = error;
  }

  getEpisodes() {
    return this.episodes;
  }

  isLoading() {
    return this.loading;
  }

  getError() {
    return this.error;
  }

  getInfo() {
    return this.info;
  }
}

export default EpisodeController;
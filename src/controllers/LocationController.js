import LocationService from '../services/LocationService.js';

class LocationController {
  constructor() {
    this.locations = [];
    this.loading = false;
    this.error = null;
    this.info = null;
  }

  async loadLocations() {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const data = await LocationService.getFirstFive();
      this.locations = data.results;
      this.info = data.info;
      
      return this.locations;
    } catch (error) {
      this.setError(error.message);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async loadLocationById(id) {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const location = await LocationService.getLocationById(id);
      return location;
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

  getLocations() {
    return this.locations;
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

export default LocationController;
import ApiService from './ApiService.js';
import Location from '../models/Location.js';

class LocationService {
  static async getAllLocations(page = 1) {
    try {
      const data = await ApiService.getPage('/location', page);
      return {
        info: data.info,
        results: data.results.map(location => new Location(location))
      };
    } catch (error) {
      throw new Error(`Error al obtener ubicaciones: ${error.message}`);
    }
  }

  static async getLocationById(id) {
    try {
      const data = await ApiService.getById('/location', id);
      return new Location(data);
    } catch (error) {
      throw new Error(`Error al obtener ubicación: ${error.message}`);
    }
  }

  static async getMultipleLocations(ids) {
    try {
      const data = await ApiService.getMultiple('/location', ids);
      return Array.isArray(data) 
        ? data.map(location => new Location(location))
        : [new Location(data)];
    } catch (error) {
      throw new Error(`Error al obtener ubicaciones: ${error.message}`);
    }
  }

  static async getFirstFive() {
    try {
      const data = await this.getAllLocations(1);
      return {
        ...data,
        results: data.results.slice(0, 5)
      };
    } catch (error) {
      throw error;
    }
  }

  static async getWithPagination(page = 1) {
    try {
      const data = await this.getAllLocations(page);
      return {
        locations: data.results,
        info: data.info,
        hasNextPage: !!data.info.next,
        currentPage: page
      };
    } catch (error) {
      throw error;
    }
  }
}

export default LocationService;
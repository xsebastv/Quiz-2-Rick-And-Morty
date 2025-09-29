import ApiService from './ApiService.js';
import Episode from '../models/Episode.js';

class EpisodeService {
  static async getAllEpisodes(page = 1) {
    try {
      const data = await ApiService.getPage('/episode', page);
      return {
        info: data.info,
        results: data.results.map(episode => new Episode(episode))
      };
    } catch (error) {
      throw new Error(`Error al obtener episodios: ${error.message}`);
    }
  }

  static async getEpisodeById(id) {
    try {
      const data = await ApiService.getById('/episode', id);
      return new Episode(data);
    } catch (error) {
      throw new Error(`Error al obtener episodio: ${error.message}`);
    }
  }

  static async getMultipleEpisodes(ids) {
    try {
      const data = await ApiService.getMultiple('/episode', ids);
      return Array.isArray(data) 
        ? data.map(episode => new Episode(episode))
        : [new Episode(data)];
    } catch (error) {
      throw new Error(`Error al obtener episodios: ${error.message}`);
    }
  }

  static async getFirstFive() {
    try {
      const data = await this.getAllEpisodes(1);
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
      const data = await this.getAllEpisodes(page);
      return {
        episodes: data.results,
        info: data.info,
        hasNextPage: !!data.info.next,
        currentPage: page
      };
    } catch (error) {
      throw error;
    }
  }
}

export default EpisodeService;
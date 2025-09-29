import ApiService from './ApiService.js';
import Character from '../models/Character.js';

class CharacterService {
  static async getAllCharacters(page = 1) {
    try {
      const data = await ApiService.getPage('/character', page);
      return {
        info: data.info,
        results: data.results.map(char => new Character(char))
      };
    } catch (error) {
      throw new Error(`Error al obtener personajes: ${error.message}`);
    }
  }

  static async getCharacterById(id) {
    try {
      const data = await ApiService.getById('/character', id);
      return new Character(data);
    } catch (error) {
      throw new Error(`Error al obtener personaje: ${error.message}`);
    }
  }

  static async getMultipleCharacters(ids) {
    try {
      const data = await ApiService.getMultiple('/character', ids);
      return Array.isArray(data) 
        ? data.map(char => new Character(char))
        : [new Character(data)];
    } catch (error) {
      throw new Error(`Error al obtener personajes: ${error.message}`);
    }
  }

  static async getFirstFive() {
    try {
      const data = await this.getAllCharacters(1);
      return {
        ...data,
        results: data.results.slice(0, 5)
      };
    } catch (error) {
      throw error;
    }
  }
}

export default CharacterService;
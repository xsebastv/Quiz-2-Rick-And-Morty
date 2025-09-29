import CharacterService from '../services/CharacterService.js';

class CharacterController {
  constructor() {
    this.characters = [];
    this.loading = false;
    this.error = null;
    this.info = null;
  }

  async loadCharacters() {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const data = await CharacterService.getFirstFive();
      this.characters = data.results;
      this.info = data.info;
      
      return this.characters;
    } catch (error) {
      this.setError(error.message);
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async loadCharacterById(id) {
    try {
      this.setLoading(true);
      this.setError(null);
      
      const character = await CharacterService.getCharacterById(id);
      return character;
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

  getCharacters() {
    return this.characters;
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

export default CharacterController;
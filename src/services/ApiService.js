// Configuración base de la API
const API_BASE_URL = 'https://rickandmortyapi.com/api';

// Servicio base para manejar peticiones HTTP
class ApiService {
  static async request(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error(`Error al obtener datos: ${error.message}`);
    }
  }

  static async getPage(endpoint, page = 1) {
    return this.request(`${endpoint}?page=${page}`);
  }

  static async getById(endpoint, id) {
    return this.request(`${endpoint}/${id}`);
  }

  static async getMultiple(endpoint, ids) {
    return this.request(`${endpoint}/${ids.join(',')}`);
  }
}

export default ApiService;
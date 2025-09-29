// Modelo para Location
export class Location {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.dimension = data.dimension;
    this.residents = data.residents;
    this.url = data.url;
    this.created = new Date(data.created);
  }

  // Métodos del modelo
  getResidentsCount() {
    return this.residents.length;
  }

  getFormattedCreatedDate() {
    return this.created.toLocaleDateString('es-ES');
  }

  hasResidents() {
    return this.residents.length > 0;
  }

  getDimensionInfo() {
    return this.dimension !== 'unknown' ? this.dimension : 'Dimensión desconocida';
  }
}

export default Location;
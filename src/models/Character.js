// Modelo para Character
export class Character {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.status = data.status;
    this.species = data.species;
    this.type = data.type;
    this.gender = data.gender;
    this.origin = data.origin;
    this.location = data.location;
    this.image = data.image;
    this.episode = data.episode;
    this.url = data.url;
    this.created = new Date(data.created);
  }

  // Métodos del modelo
  isAlive() {
    return this.status === 'Alive';
  }

  isDead() {
    return this.status === 'Dead';
  }

  isUnknown() {
    return this.status === 'unknown';
  }

  getStatusColor() {
    switch (this.status.toLowerCase()) {
      case 'alive':
        return '#55cc44';
      case 'dead':
        return '#d63031';
      default:
        return '#9b59b6';
    }
  }

  getFormattedCreatedDate() {
    return this.created.toLocaleDateString('es-ES');
  }
}

export default Character;
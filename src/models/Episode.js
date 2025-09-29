// Modelo para Episode
export class Episode {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.airDate = data.air_date;
    this.episode = data.episode;
    this.characters = data.characters;
    this.url = data.url;
    this.created = new Date(data.created);
  }

  // Métodos del modelo
  getCharactersCount() {
    return this.characters.length;
  }

  getFormattedCreatedDate() {
    return this.created.toLocaleDateString('es-ES');
  }

  getFormattedAirDate() {
    if (!this.airDate) return 'Fecha no disponible';
    
    // Convertir la fecha del formato "December 2, 2013" a formato español
    try {
      const date = new Date(this.airDate);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return this.airDate; // Retornar la fecha original si hay error
    }
  }

  getSeasonNumber() {
    const match = this.episode.match(/S(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  getEpisodeNumber() {
    const match = this.episode.match(/E(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  getFormattedEpisodeCode() {
    const season = this.getSeasonNumber();
    const episode = this.getEpisodeNumber();
    return `Temporada ${season}, Episodio ${episode}`;
  }
}

export default Episode;
export abstract class BasicDTO {
  static from(entity: any, type: 'inline' | 'export' = 'export') {
    if (!entity) return null;
    if (type === 'inline') return this.shape(entity);
    return { data: this.shape(entity) };
  }

  static pagination(entity: any[], total: number, perPage = 10, page = 1) {
    return {
      total: total,
      count: entity.length,
      per_page: perPage,
      current_page: page,
      total_pages: Math.floor(total / perPage),
    };
  }

  static paginate(entities: { results: any[]; total: number }) {
    return {
      data: this.shapeMany(entities.results),
      pagination: this.pagination(entities.results, entities.total),
    };
  }

  static shapeMany(entities: any[]) {
    return entities.map((entity) => this.shape(entity));
  }

  static fromMany(
    entities: any[] | undefined,
    type: 'inline' | 'export' = 'export'
  ) {
    if (!entities || !entities.length) {
      if (type === 'inline') return [];
      return { data: [] };
    }

    if (type === 'inline') return this.shapeMany(entities);
    return { data: this.shapeMany(entities) };
  }

  static shape(entity: any): any {}
}

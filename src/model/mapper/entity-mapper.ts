export class EntityCouchDbMapper<E> {
  constructor() {}
  public toEntity(from: any, to: E, notMappedfields?: Array<string>): E {
    const result: any = Object.assign({}, to);
    if (notMappedfields) {
      notMappedfields.push("type");
    } else {
      notMappedfields = ["type"];
    }
    Object.keys(to).forEach((key) => {
      if (!notMappedfields.includes(key) && key !== "type") {
        result[key] = from[key];
      }
    });
    result.id = result._id;
    return result;
  }
  public toEntities(froms: any[], to: E, notMappedfields?: Array<string>): E[] {
    const result: E[] = [];
    if (froms) {
      for (const from of froms) {
        result.push(this.toEntity(from, to, notMappedfields));
      }
    }
    return result;
  }
}

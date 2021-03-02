import {
  IAbstractCouchDbEntity
} from "@entities/abstract-couchdb.model";
import { EntityType } from "@entities/entity-type";
import { DatabaseService } from "@service/database.service";
import {
  NoParamConstructor,
  ProcessCouchDbResponse as ProcessCouchDbResponseService
} from "@service/process-response.service";

export interface ICrudRepository<T> {
  getOne: (id: string | number) => Promise<T | null>;
  getAll: () => Promise<T[]>;
  add: (entity: T) => Promise<T>;
  update: (entity: T) => Promise<T>;
  delete: (id: string | number, rev: string) => Promise<T>;
}

export class CrudRepository<T extends IAbstractCouchDbEntity>
implements ICrudRepository<T> {
  protected readonly dbService: DatabaseService = new DatabaseService();
  ctor: NoParamConstructor<T>;
  protected processService: ProcessCouchDbResponseService<T>;
  private entityType: EntityType;
  constructor(
    processService: ProcessCouchDbResponseService<T>,
    entityType: EntityType
  ) {
    this.processService = processService;
    this.entityType = entityType;
  }

  /**
   * @param id
   */
  public getOne(id: string | number): Promise<T> {
    const db = this.dbService.getDatasource();
    let entity: T;
    return db
      .get(String(id))
      .then((res) => {
        entity = this.processService.processGetResponse(res);
        return entity;
      })
      .catch((err) => {
        return err;
      });
  }

  public getAll(): Promise<T[]> {
    const db = this.dbService.getDatasource();
    const q = {
      selector: {
        type: { $eq: String(this.entityType) },
      },
    };
    let entities: T[] = [];
    return db
      .find(q)
      .then((res) => {
        entities = this.processService.processQueryResponse(res);
        return entities;
      })
      .catch((err) => {
        return err;
      });
  }

  /**
   *
   * @param entity
   */
  public async add(entity: T, creatorUsername?: string): Promise<T> {
    const uuid = await this.dbService.getUuid();
    entity._id = uuid;
    const db = this.dbService.getDatasource();
    entity.createdDate = new Date();
    entity.lastModifiedDate = entity.createdDate;
    entity.createdBy = creatorUsername;
    entity.lastModifiedBy = creatorUsername;
    return db
      .insert(entity)
      .then((res) => {
        return this.processService.processInsertResponse(res);
      })
      .catch((err) => {
        return err;
      });
  }

  public async update(entity: T, creatorUsername?: string): Promise<T> {
    const db = this.dbService.getDatasource();
    entity.lastModifiedDate = new Date();
    entity.lastModifiedBy = creatorUsername;
    return db
      .insert(entity)
      .then((res) => {
        return this.processService.processInsertResponse(res);
      })
      .catch((err) => {
        return err;
      });
  }

  public async delete(id: string | number, rev: string): Promise<T> {
    const db = this.dbService.getDatasource();
    return db.destroy(String(id), rev).then((res) => {
      return this.processService.processDestroyResponse(res);
    });
  }
}

import { IAbstractCouchDbEntity } from "src/model/abstract-couchdb.model";
import { EntityType } from "@model/entity-type.model";
import { DatabaseService } from "@service/database.service";
import {
  NoParamConstructor,
  ProcessCouchDbResponse as ProcessCouchDbResponseService,
} from "@service/process-response.service";

export interface ICrudService<T> {
  getOne: (id: string | number) => Promise<T | null>;
  getAll: () => Promise<T[]>;
  add: (entity: T) => Promise<T>;
  update: (entity: T) => Promise<T>;
  delete: (id: string | number, rev: string) => Promise<T>;
}

export abstract class CrudService<T extends IAbstractCouchDbEntity>
implements ICrudService<T> {
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
   * Get one entity by the given id
   * @param id
   * @returns entity
   */
  public getOne(id: string | number): Promise<T> {
    const db = this.dbService.getDatasource();
    let entity: T;
    return db.get(String(id)).then((res) => {
      entity = this.processService.processGetResponse(res);
      return entity;
    });
    /*       .catch((err) => {
        return err;
      }); */
  }

  /**
   * Get all entities
   * @returns all entities
   */
  public getAll(): Promise<T[]> {
    const db = this.dbService.getDatasource();
    const q = {
      selector: {
        type: { $eq: String(this.entityType) },
      },
    };
    let entities: T[] = [];
    return db.find(q).then((res) => {
      entities = this.processService.processQueryResponse(res);
      return entities;
    });
    /*       .catch((err) => {
        return err;
      }); */
  }

  /**
   * Creates a new entity
   * @param entity
   * @param creatorUsername
   * @returns created entity
   */
  public async add(entity: T, creatorUsername?: string): Promise<T> {
    const uuid = await this.dbService.getUuid();
    entity._id = uuid;
    const db = this.dbService.getDatasource();
    entity.createdDate = new Date();
    entity.lastModifiedDate = entity.createdDate;
    entity.createdBy = creatorUsername;
    entity.lastModifiedBy = creatorUsername;
    return db.insert(entity).then((res) => {
      return this.processService.processInsertResponse(res);
    });
    /*       .catch((err) => {
        return err;
      }); */
  }

  /**
   * Updates an entity
   * @param entity
   * @param creatorUsername
   * @returns updated entity
   */
  public async update(entity: T, creatorUsername?: string): Promise<T> {
    const db = this.dbService.getDatasource();
    entity.lastModifiedDate = new Date();
    entity.lastModifiedBy = creatorUsername;
    return db.insert(entity).then((res) => {
      return this.processService.processInsertResponse(res);
    });
    /*       .catch((err) => {
              return err;
            }); */
  }

  /**
   * Deletes an entity with the given id
   * @param id
   * @param rev
   * @returns
   */
  public async delete(id: string | number, rev: string): Promise<T> {
    const db = this.dbService.getDatasource();
    return db.destroy(String(id), rev).then((res) => {
      return this.processService.processDestroyResponse(res);
    });
  }
}

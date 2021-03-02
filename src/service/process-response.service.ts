import Nano from "nano";
import logger from "@shared/Logger";
import { BulkOperationError } from "@entities/error/BulkOperationError";
import { EntityCouchDbMapper } from "@repository/mapper/entity-mapper";
import { UniqueResponseExpectedError } from "@entities/error/UniqueResponseExpectedError";

export interface NoParamConstructor<T> {
  new (): T;
}

export interface IProcessCouchDbResponse<T> {
  processInsertResponse(response: Nano.DocumentInsertResponse): T;
  processBulkResponse(response: Nano.DocumentBulkResponse): T;
  processDestroyResponse(response: Nano.DocumentDestroyResponse): T;
  processGetResponse(response: Nano.DocumentGetResponse): T;
  processQueryForOneResponse(response: Nano.MangoResponse<T>): T;
  processQueryResponse(response: Nano.MangoResponse<T[]>): T[];
}

export class ProcessCouchDbResponse<T extends Nano.MaybeDocument>
implements IProcessCouchDbResponse<T> {
  readonly data: T;
  public constructor(ctor: NoParamConstructor<T>) {
    this.data = new ctor();
  }

  public processInsertResponse(response: Nano.DocumentInsertResponse): T {
    logger.info("Process Insert Response for entity with id " + response.id);
    const entity = this.data;
    if (response.ok === true) {
      entity._id = response.id;
      entity._rev = response.rev;
    } else {
      logger.err("Error during insert");
      throw new Error("Problem during insert");
    }
    return entity;
  }

  public processBulkResponse(response: Nano.DocumentBulkResponse): T {
    const entity = this.data;
    if (response.error) {
      throw new BulkOperationError(
        "Problem during bulk operation",
        response.error,
        response.reason
      );
    }
    entity._id = response.id;
    entity._rev = response.rev;
    return entity;
  }

  public processDestroyResponse(response: Nano.DocumentDestroyResponse): T {
    logger.info("Process Destroy Response for entity with id " + response.id);
    const entity = this.data;
    if (response.ok === true) {
      entity._id = response.id;
      entity._rev = response.rev;
    } else {
      logger.err("Error during destroy");
      throw new Error("Problem during destroy");
    }
    return entity;
  }

  public processGetResponse(response: Nano.DocumentGetResponse): T {
    logger.info("Process Get Response for entity with id " + response._id);
    let entity = this.data;
    if (response._conflicts && response._conflicts.length > 0) {
      logger.warn("Conflicts for document with id " + response._id);
      throw new Error("Problem during destroy");
    }
    const mapper = new EntityCouchDbMapper<T>();
    entity = mapper.toEntity(response, entity);
    return entity;
  }

  public processQueryForOneResponse(response: Nano.MangoResponse<any>): T {
    logger.info("Process Query Response for entity with id ");
    if (response.warning) {
      logger.warn(response.warning);
    }
    let entity = this.data;
    if (response.docs && response.docs.length > 1) {
      logger.err("Multiple response for query, only one was expected");
      throw new UniqueResponseExpectedError();
    } else if (response.docs && response.docs.length === 1) {
      const mapper = new EntityCouchDbMapper<T>();
      entity = mapper.toEntity(response.docs[0], entity);
    }
    return entity;
  }

  public processQueryResponse(response: Nano.MangoResponse<any>): T[] {
    logger.info("Process Query Response");
    if (response.warning) {
      logger.warn(response.warning);
    }
    const entity = this.data;
    let result: T[];
    if (response.docs) {
      const mapper = new EntityCouchDbMapper<T>();
      result = mapper.toEntities(response.docs, entity);
    }
    return result;
  }
}

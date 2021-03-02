import { Authority } from "@entities/authority";
import { EntityType } from "@entities/entity-type";
import { CrudRepository } from "@repository/CrudRepository";
import { ProcessCouchDbResponse } from "@service/process-response.service";

class AuthoritiesProcessCouchDbResponse extends ProcessCouchDbResponse<Authority> {
  constructor() {
    super(Authority);
  }
}

export class AuthoritiesRepository extends CrudRepository<Authority> {
  constructor() {
    super(new AuthoritiesProcessCouchDbResponse(), EntityType.AUTHORITY);
  }
}

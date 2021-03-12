import { Authority } from "@model/authority.model";
import { EntityType } from "@model/entity-type.model";
import { ProcessCouchDbResponse } from "@service/process-response.service";
import { CrudService } from "@service/crud.service";

class AuthoritiesProcessCouchDbResponse extends ProcessCouchDbResponse<Authority> {
  constructor() {
    super(Authority);
  }
}

export class AuthoritiesService extends CrudService<Authority> {
  constructor() {
    super(new AuthoritiesProcessCouchDbResponse(), EntityType.AUTHORITY);
  }
}

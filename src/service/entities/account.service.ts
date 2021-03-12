import { EntityType } from "@model/entity-type.model";
import { Account } from "@model/user.model";
import { CrudService } from "@service/crud.service";
import { ProcessCouchDbResponse } from "@service/process-response.service";

class AccountProcessCouchDbResponse extends ProcessCouchDbResponse<Account> {
  constructor() {
    super(Account);
  }
}

export class AccountService extends CrudService<Account> {
  constructor() {
    super(new AccountProcessCouchDbResponse(), EntityType.USER);
  }
}

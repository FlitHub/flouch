import { EntityType } from "@entities/entity-type";
import { Account } from "@entities/user";
import { CrudRepository } from "@repository/CrudRepository";
import { ProcessCouchDbResponse } from "@service/process-response.service";

class AccountProcessCouchDbResponse extends ProcessCouchDbResponse<Account> {
  constructor() {
    super(Account);
  }
}

export class AccountService extends CrudRepository<Account> {
  constructor() {
    super(new AccountProcessCouchDbResponse(), EntityType.USER);
  }
}

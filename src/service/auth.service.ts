import * as bcrypt from "bcryptjs";

export abstract class AuthService {
  public static hashPassword(password: string) {
    return bcrypt.hashSync(password, 8);
  }

  public static checkIfUnencryptedPasswordIsValid(
    unencryptedPassword: string,
    password: string
  ) {
    return bcrypt.compareSync(unencryptedPassword, password);
  }
}

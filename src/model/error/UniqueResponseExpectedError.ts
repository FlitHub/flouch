export class UniqueResponseExpectedError extends Error {
  constructor(message?: string) {
    super(message);
    // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
    Object.setPrototypeOf(this, UniqueResponseExpectedError.prototype); // restore prototype chain
    this.name = UniqueResponseExpectedError.name; // stack traces display correctly now
  }
}

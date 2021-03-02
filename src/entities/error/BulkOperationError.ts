export class BulkOperationError extends Error {
  error?: string;
  reason?: string;
  constructor(message?: string, error?: string, reason?: string) {
    super(message);
    // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
    Object.setPrototypeOf(this, BulkOperationError.prototype); // restore prototype chain
    this.name = BulkOperationError.name; // stack traces display correctly now
    this.error = error;
    this.reason = reason;
  }
}

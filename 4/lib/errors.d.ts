
/**
 * The Base Error all Sequelize Errors inherit from.
 */
export class BaseError extends Error {
  name: string;
}

/**
 * Scope Error. Thrown when the sequelize cannot query the specified scope.
 */
export class SequelizeScopeError extends BaseError { }

export class ValidationError extends BaseError {

  /** Array of ValidationErrorItem objects describing the validation errors */
  errors: ValidationErrorItem[];

  /**
   * Validation Error. Thrown when the sequelize validation has failed. The error contains an `errors`
   * property, which is an array with 1 or more ValidationErrorItems, one for each validation that failed.
   *
   * @param message Error message
   * @param errors  Array of ValidationErrorItem objects describing the validation errors
   */
  constructor(message: string, errors?: ValidationErrorItem[]);

  /**
   * Gets all validation error items for the path / field specified.
   *
   * @param path The path to be checked for error items
   */
  get(path: string): ValidationErrorItem[];

}

export class ValidationErrorItem {

  /** An error message */
  message: string;

  /** The type of the validation error */
  type: string;

  /** The field that triggered the validation error */
  path: string;

  /** The value that generated the error */
  value: string;

  /**
   * Validation Error Item
   * Instances of this class are included in the `ValidationError.errors` property.
   *
   * @param message An error message
   * @param type The type of the validation error
   * @param path The field that triggered the validation error
   * @param value The value that generated the error
   */
  constructor(message?: string, type?: string, path?: string, value?: string);

}

export class DatabaseError extends BaseError {

  /** The database specific error which triggered this one */
  parent: Error;

  /** The database specific error which triggered this one */
  original: Error;

  /** The SQL that triggered the error */
  sql: string;

  /**
   * A base class for all database related errors.
   * @param parent The database specific error which triggered this one
   */
  constructor(parent: Error);
}

/** Thrown when a database query times out because of a deadlock */
export class TimeoutError extends DatabaseError { }

/**
 * Thrown when a unique constraint is violated in the database
 */
export class UniqueConstraintError extends DatabaseError {
  errors: ValidationErrorItem[];
  fields: { [field: string]: string };
  constructor(options?: { parent?: Error, message?: string, errors?: ValidationErrorItem[] });
}

/**
 * Thrown when a foreign key constraint is violated in the database
 */
export class ForeignKeyConstraintError extends DatabaseError {
  table: string;
  fields: { [field: string]: string };
  value: any;
  index: string;
  constructor(options: { parent?: Error, message?: string, index?: string, fields?: string[], table?: string });
}

/**
 * Thrown when an exclusion constraint is violated in the database
 */
export class ExclusionConstraintError extends DatabaseError {
  constraint: string;
  fields: { [field: string]: string };
  table: string;
  constructor(options: { parent?: Error, message?: string, constraint?: string, fields?: string[], table?: string });
}

/**
 * A base class for all connection related errors.
 */
export class ConnectionError extends BaseError {
  parent: Error;
  original: Error;
  constructor(parent: Error);
}

/**
 * Thrown when a connection to a database is refused
 */
export class ConnectionRefusedError extends ConnectionError { }

/**
 * Thrown when a connection to a database is refused due to insufficient privileges
 */
export class AccessDeniedError extends ConnectionError { }

/**
 * Thrown when a connection to a database has a hostname that was not found
 */
export class HostNotFoundError extends ConnectionError { }

/**
 * Thrown when a connection to a database has a hostname that was not reachable
 */
export class HostNotReachableError extends ConnectionError { }


/**
 * Thrown when a connection to a database has invalid values for any of the connection parameters
 */
export class InvalidConnectionError extends ConnectionError { }

/**
 * Thrown when a connection to a database times out
 */
export class ConnectionTimedOutError extends ConnectionError { }

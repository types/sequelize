// Type definitions for Sequelize 3.x
// Project: http://sequelizejs.com

import SequelizePromise = require('./lib/promise');
import {DataType, DataTypes as LibDataTypes} from './lib/data-types';

import Utils = require('./lib/utils');
import {Validator} from './lib/utils/validator-extras';

import {
  Association,
  HasOne,
  HasOneOptions,
  BelongsTo,
  BelongsToOptions,
  HasMany,
  HasManyOptions,
  BelongsToMany,
  BelongsToManyOptions
} from './lib/associations/index';

declare namespace Sequelize {

  export type Promise<T> = SequelizePromise<T>;
  export type DataTypes = LibDataTypes;

  /**
   * Sequelize methods available only for the static class ( basically this is the constructor and some extends )
   */
  export interface Static extends SequelizeStaticAndInstance, DataTypes {

    /**
     * Instantiate sequelize with name of database, username and password
     *
     * #### Example usage
     *
     * ```javascript
     * // without password and options
     * var sequelize = new Sequelize('database', 'username')
     *
     * // without options
     * var sequelize = new Sequelize('database', 'username', 'password')
     *
     * // without password / with blank password
     * var sequelize = new Sequelize('database', 'username', null, {})
     *
     * // with password and options
     * var sequelize = new Sequelize('my_database', 'john', 'doe', {})
     *
     * // with uri (see below)
     * var sequelize = new Sequelize('mysql://localhost:3306/database', {})
     * ```
     *
     * @param database The name of the database
     * @param username The username which is used to authenticate against the
     *     database.
     * @param password The password which is used to authenticate against the
     *     database.
     * @param options An object with options.
     */
    new (database: string, username: string, password: string, options?: Options): Connection;
    new (database: string, username: string, options?: Options): Connection;

    /**
     * Instantiate sequelize with an URI
     * @name Sequelize
     * @constructor
     *
     * @param uri A full database URI
     * @param options See above for possible options
     */
    new (uri: string, options?: Options): Connection;
  }

  //
  //  Errors
  // ~~~~~~~~
  //
  //  https://github.com/sequelize/sequelize/blob/v3.4.1/lib/errors.js
  //

  /**
   * The Base Error all Sequelize Errors inherit from.
   */
  export interface BaseError extends Error, ErrorConstructor { }

  export interface ValidationError extends BaseError {

    /**
     * Validation Error. Thrown when the sequelize validation has failed. The error contains an `errors`
     * property, which is an array with 1 or more ValidationErrorItems, one for each validation that failed.
     *
     * @param message Error message
     * @param errors  Array of ValidationErrorItem objects describing the validation errors
     */
    new (message: string, errors?: Array<ValidationErrorItem>): ValidationError;

    /**
     * Gets all validation error items for the path / field specified.
     *
     * @param path The path to be checked for error items
     */
    get(path: string): Array<ValidationErrorItem>;

    /** Array of ValidationErrorItem objects describing the validation errors */
    errors: Array<ValidationErrorItem>;

  }

  export interface ValidationErrorItem extends BaseError {

    /**
     * Validation Error Item
     * Instances of this class are included in the `ValidationError.errors` property.
     *
     * @param message An error message
     * @param type The type of the validation error
     * @param path The field that triggered the validation error
     * @param value The value that generated the error
     */
    new (message: string, type: string, path: string, value: string): ValidationErrorItem;

    /** An error message */
    message: string;

    /** The type of the validation error */
    type: string;

    /** The field that triggered the validation error */
    path: string;

    /** The value that generated the error */
    value: string;

  }

  export interface DatabaseError extends BaseError {

    /**
     * A base class for all database related errors.
     */
    new (parent: Error): DatabaseError;

  }

  export interface TimeoutError extends DatabaseError {

    /**
     * Thrown when a database query times out because of a deadlock
     */
    new (parent: Error): TimeoutError;

  }

  export interface UniqueConstraintError extends DatabaseError {

    /**
     * Thrown when a unique constraint is violated in the database
     */
    new (options: { parent?: Error, message?: string, errors?: Object }): UniqueConstraintError;

  }

  export interface ForeignKeyConstraintError extends DatabaseError {

    /** The name of the foreign key constraint */
    index: string;

    /**
     * Thrown when a foreign key constraint is violated in the database
     */
    new (options: { parent?: Error, message?: string, index?: string, fields?: Array<string>, table?: string }): ForeignKeyConstraintError;

  }

  export interface ExclusionConstraintError extends DatabaseError {

    /**
     * Thrown when an exclusion constraint is violated in the database
     */
    new (options: { parent?: Error, message?: string, constraint?: string, fields?: Array<string>, table?: string }): ExclusionConstraintError;

  }

  export interface ConnectionError extends BaseError {

    /**
     * A base class for all connection related errors.
     */
    new (parent: Error): ConnectionError;

  }

  export interface ConnectionRefusedError extends ConnectionError {

    /**
     * Thrown when a connection to a database is refused
     */
    new (parent: Error): ConnectionRefusedError;

  }

  export interface AccessDeniedError extends ConnectionError {

    /**
     * Thrown when a connection to a database is refused due to insufficient privileges
     */
    new (parent: Error): AccessDeniedError;

  }

  export interface HostNotFoundError extends ConnectionError {

    /**
     * Thrown when a connection to a database has a hostname that was not found
     */
    new (parent: Error): HostNotFoundError;

  }

  export interface HostNotReachableError extends ConnectionError {

    /**
     * Thrown when a connection to a database has a hostname that was not reachable
     */
    new (parent: Error): HostNotReachableError;

  }

  export interface InvalidConnectionError extends ConnectionError {

    /**
     * Thrown when a connection to a database has invalid values for any of the connection parameters
     */
    new (parent: Error): InvalidConnectionError;

  }

  export interface ConnectionTimedOutError extends ConnectionError {

    /**
     * Thrown when a connection to a database times out
     */
    new (parent: Error): ConnectionTimedOutError;

  }

  /**
   * Sequelize provides a host of custom error classes, to allow you to do easier debugging. All of these errors
   * are exposed on the sequelize object and the sequelize constructor. All sequelize errors inherit from the
   * base JS error object.
   */
  export interface Errors {
    Error: BaseError;
    ValidationError: ValidationError;
    ValidationErrorItem: ValidationErrorItem;
    DatabaseError: DatabaseError;
    TimeoutError: TimeoutError;
    UniqueConstraintError: UniqueConstraintError;
    ExclusionConstraintError: ExclusionConstraintError;
    ForeignKeyConstraintError: ForeignKeyConstraintError;
    ConnectionError: ConnectionError;
    ConnectionRefusedError: ConnectionRefusedError;
    AccessDeniedError: AccessDeniedError;
    HostNotFoundError: HostNotFoundError;
    HostNotReachableError: HostNotReachableError;
    InvalidConnectionError: InvalidConnectionError;
    ConnectionTimedOutError: ConnectionTimedOutError;
  }

  //
  //  Hooks
  // ~~~~~~~
  //
  //  https://github.com/sequelize/sequelize/blob/v3.4.1/lib/hooks.js
  //

  /**
   * Options for Sequelize.define. We mostly duplicate the Hooks here, since there is no way to combine the two
   * interfaces.
   *
   * beforeValidate, afterValidate, beforeBulkCreate, beforeBulkDestroy, beforeBulkUpdate, beforeCreate,
   * beforeDestroy, beforeUpdate, afterCreate, afterDestroy, afterUpdate, afterBulkCreate, afterBulkDestroy and
   * afterBulkUpdate.
   */
  export interface HooksOptions<TModel extends Model<TInstance>, TInstance extends Instance> {

    beforeValidate?: (instance: TInstance, options: Object) => any;
    afterValidate?: (instance: TInstance, options: Object) => any;
    beforeCreate?: (attributes: TInstance, options: CreateOptions<TModel, TInstance>) => any;
    afterCreate?: (attributes: TInstance, options: CreateOptions<TModel, TInstance>) => any;
    beforeDestroy?: (instance: TInstance, options: InstanceDestroyOptions) => any;
    beforeDelete?: (instance: TInstance, options: InstanceDestroyOptions) => any;
    afterDestroy?: (instance: TInstance, options: InstanceDestroyOptions) => any;
    afterDelete?: (instance: TInstance, options: InstanceDestroyOptions) => any;
    beforeUpdate?: (instance: TInstance, options: InstanceUpdateOptions<TInstance>) => any;
    afterUpdate?: (instance: TInstance, options: InstanceUpdateOptions<TInstance>) => any;
    beforeBulkCreate?: (instances: Array<TInstance>, options: BulkCreateOptions<TInstance>) => any;
    afterBulkCreate?: (instances: Array<TInstance>, options: BulkCreateOptions<TInstance>) => any;
    beforeBulkDestroy?: (options: DestroyOptions<TInstance>) => any;
    beforeBulkDelete?: (options: DestroyOptions<TInstance>) => any;
    afterBulkDestroy?: (options: DestroyOptions<TInstance>) => any;
    afterBulkDelete?: (options: DestroyOptions<TInstance>) => any;
    beforeBulkUpdate?: (options: UpdateOptions<TInstance>) => any;
    afterBulkUpdate?: (options: UpdateOptions<TInstance>) => any;
    beforeFind?: (options: FindOptions<TModel, TInstance>) => any;
    beforeCount?: (options: CountOptions<TModel, TInstance>) => any;
    beforeFindAfterExpandIncludeAll?: (options: FindOptions<TModel, TInstance>) => any;
    beforeFindAfterOptions?: (options: FindOptions<TModel, TInstance>) => any;
    afterFind?: (instancesOrInstance: Array<TInstance> | TInstance, options: FindOptions<TModel, TInstance>) => any;
    beforeSync?: (options: SyncOptions) => any;
    afterSync?: (options: SyncOptions) => any;
    beforeBulkSync?: (options: SyncOptions) => any;
    afterBulkSync?: (options: SyncOptions) => any;
  }

  //
  //  Query Types
  // ~~~~~~~~~~~~~
  //
  //  https://github.com/sequelize/sequelize/blob/v3.4.1/lib/query-types.js
  //

  export interface QueryTypes {
    SELECT: string // 'SELECT'
    INSERT: string // 'INSERT'
    UPDATE: string // 'UPDATE'
    BULKUPDATE: string // 'BULKUPDATE'
    BULKDELETE: string // 'BULKDELETE'
    DELETE: string // 'DELETE'
    UPSERT: string // 'UPSERT'
    VERSION: string // 'VERSION'
    SHOWTABLES: string // 'SHOWTABLES'
    SHOWINDEXES: string // 'SHOWINDEXES'
    DESCRIBE: string // 'DESCRIBE'
    RAW: string // 'RAW'
    FOREIGNKEYS: string // 'FOREIGNKEYS'
  }

  //
  //  Sequelize
  // ~~~~~~~~~~~
  //
  //  https://github.com/sequelize/sequelize/blob/v3.4.1/lib/sequelize.js
  //

  /**
   * General column options
   */
  export interface ColumnOptions<TColumn> {

    /**
     * If false, the column will have a NOT NULL constraint, and a not null validation will be run before an
     * instance is saved.
     */
    allowNull?: boolean;

    /**
     *  If set, sequelize will map the attribute name to a different name in the database
     */
    field?: string;

    /**
     * A literal default value, a JavaScript function, or an SQL function (see `sequelize.fn`)
     */
    defaultValue?: TColumn | fn | literal;
  }

  /**
   * References options for the column's attributes
   *
   * @see AttributecolumnOptions
   */
  export interface DefineAttributeColumnReferencesOptions {

    /**
     * If this column references another table, provide it here as a Model, or a string
     */
    model?: string | Model<any>;

    /**
     * The column of the foreign table that this column references
     */
    key?: string;

    /**
     * When to check for the foreign key constraing
     *
     * PostgreSQL only
     */
    deferrable?: Deferrable;

  }

  /**
   * Column options for the model schema attributes
   */
  export interface DefineAttributeColumnOptions<TInstance extends Instance, TAttribute> extends ColumnOptions<TAttribute> {

    /**
     * A string or a data type
     */
    type: DataType;

    /**
     * If true, the column will get a unique constraint. If a string is provided, the column will be part of a
     * composite unique index. If multiple columns have the same string, they will be part of the same unique
     * index
     */
    unique?: boolean | string | { name: string, msg: string };

    /**
     * Primary key flag
     */
    primaryKey?: boolean;

    /**
     * Is this field an auto increment field
     */
    autoIncrement?: boolean;

    /**
     * Comment for the database
     */
    comment?: string;

    /**
     * An object with reference configurations
     */
    references?: DefineAttributeColumnReferencesOptions;

    /**
     * What should happen when the referenced key is updated. One of CASCADE, RESTRICT, SET DEFAULT, SET NULL or
     * NO ACTION
     */
    onUpdate?: string;

    /**
     * What should happen when the referenced key is deleted. One of CASCADE, RESTRICT, SET DEFAULT, SET NULL or
     * NO ACTION
     */
    onDelete?: string;

    /**
     * Provide a custom getter for this column. Use `this.getDataValue(String)` to manipulate the underlying
     * values.
     */
    get?: (this: TInstance) => TAttribute;

    /**
     * Provide a custom setter for this column. Use `this.setDataValue(String, Value)` to manipulate the
     * underlying values.
     */
    set?: (this: TInstance, val: TAttribute) => void;

    /**
     * An object of validations to execute for this column every time the model is saved. Can be either the
     * name of a validation provided by validator.js, a validation function provided by extending validator.js
     * (see the
     * `DAOValidator` property for more details), or a custom validation function. Custom validation functions
     * are called with the value of the field, and can possibly take a second callback argument, to signal that
     * they are asynchronous. If the validator is sync, it should throw in the case of a failed validation, it
     * it is async, the callback should be called with the error text.
     */
    validate?: DefineValidateOptions;

    /**
     * Usage in object notation
     *
     * ```js
     * sequelize.define('model', {
     *     states: {
     *       type:   Sequelize.ENUM,
     *       values: ['active', 'pending', 'deleted']
     *     }
     *   })
     * ```
     */
    values?: TAttribute[];

  }

  /**
   * Interface for Attributes provided for a column
   */
  export type DefineAttributes<TInstance extends Instance> = {

    /**
     * The description of a database column
     */
    [K in keyof TInstance]: DataType | DefineAttributeColumnOptions<TInstance, TInstance[K]>;
  }

  /**
   * Interface for query options
   *
   * @see Options
   */
  export interface QueryOptions {

    /**
     * If true, sequelize will not try to format the results of the query, or build an instance of a model from
     * the result
     */
    raw?: boolean;

    /**
     * The transaction that the query should be executed under
     */
    transaction?: Transaction;

    /**
     * The type of query you are executing. The query type affects how results are formatted before they are
     * passed back. The type is a string, but `Sequelize.QueryTypes` is provided as convenience shortcuts.
     */
    type?: string;

    /**
     * If true, transforms objects with `.` separated property names into nested objects using
     * [dottie.js](https://github.com/mickhansen/dottie.js). For example { 'user.username': 'john' } becomes
     * { user: { username: 'john' }}. When `nest` is true, the query type is assumed to be `'SELECT'`,
     * unless otherwise specified
     *
     * Defaults to false
     */
    nest?: boolean;

    /**
     * Sets the query type to `SELECT` and return a single row
     */
    plain?: boolean;

    /**
     * Either an object of named parameter replacements in the format `:param` or an array of unnamed
     * replacements to replace `?` in your SQL.
     */
    replacements?: Object | Array<string>;

    /**
     * Force the query to use the write pool, regardless of the query type.
     *
     * Defaults to false
     */
    useMaster?: boolean;

    /**
     * A function that gets executed while running the query to log the sql.
     */
    logging?: Function

    /**
     * A sequelize instance used to build the return instance
     */
    instance?: Instance;

    /**
     * A sequelize model used to build the returned model instances (used to be called callee)
     */
    model?: Model<any>;

    // TODO: force, cascade

  }

  /**
   * Model validations, allow you to specify format/content/inheritance validations for each attribute of the
   * model.
   *
   * Validations are automatically run on create, update and save. You can also call validate() to manually
   * validate an instance.
   *
   * The validations are implemented by validator.js.
   */
  export interface DefineValidateOptions {

    /**
     * is: ["^[a-z]+$",'i'] // will only allow letters
     * is: /^[a-z]+$/i      // same as the previous example using real RegExp
     */
    is?: string | Array<string | RegExp> | RegExp | { msg: string, args: string | Array<string | RegExp> | RegExp };

    /**
     * not: ["[a-z]",'i']  // will not allow letters
     */
    not?: string | Array<string | RegExp> | RegExp | { msg: string, args: string | Array<string | RegExp> | RegExp };

    /**
     * checks for email format (foo@bar.com)
     */
    isEmail?: boolean | { msg: string };

    /**
     * checks for url format (http://foo.com)
     */
    isUrl?: boolean | { msg: string };

    /**
     * checks for IPv4 (129.89.23.1) or IPv6 format
     */
    isIP?: boolean | { msg: string };

    /**
     * checks for IPv4 (129.89.23.1)
     */
    isIPv4?: boolean | { msg: string };

    /**
     * checks for IPv6 format
     */
    isIPv6?: boolean | { msg: string };

    /**
     * will only allow letters
     */
    isAlpha?: boolean | { msg: string };

    /**
     * will only allow alphanumeric characters, so "_abc" will fail
     */
    isAlphanumeric?: boolean | { msg: string };

    /**
     * will only allow numbers
     */
    isNumeric?: boolean | { msg: string };

    /**
     * checks for valid integers
     */
    isInt?: boolean | { msg: string };

    /**
     * checks for valid floating point numbers
     */
    isFloat?: boolean | { msg: string };

    /**
     * checks for any numbers
     */
    isDecimal?: boolean | { msg: string };

    /**
     * checks for lowercase
     */
    isLowercase?: boolean | { msg: string };

    /**
     * checks for uppercase
     */
    isUppercase?: boolean | { msg: string };

    /**
     * won't allow null
     */
    notNull?: boolean | { msg: string };

    /**
     * only allows null
     */
    isNull?: boolean | { msg: string };

    /**
     * don't allow empty strings
     */
    notEmpty?: boolean | { msg: string };

    /**
     * only allow a specific value
     */
    equals?: string | { msg: string };

    /**
     * force specific substrings
     */
    contains?: string | { msg: string };

    /**
     * check the value is not one of these
     */
    notIn?: Array<Array<string>> | { msg: string, args: Array<Array<string>> };

    /**
     * check the value is one of these
     */
    isIn?: Array<Array<string>> | { msg: string, args: Array<Array<string>> };

    /**
     * don't allow specific substrings
     */
    notContains?: Array<string> | string | { msg: string, args: Array<string> | string };

    /**
     * only allow values with length between 2 and 10
     */
    len?: [number, number] | { msg: string, args: [number, number] };

    /**
     * only allow uuids
     */
    isUUID?: number | { msg: string, args: number };

    /**
     * only allow date strings
     */
    isDate?: boolean | { msg: string, args: boolean };

    /**
     * only allow date strings after a specific date
     */
    isAfter?: string | { msg: string, args: string };

    /**
     * only allow date strings before a specific date
     */
    isBefore?: string | { msg: string, args: string };

    /**
     * only allow values
     */
    max?: number | { msg: string, args: number };

    /**
     * only allow values >= 23
     */
    min?: number | { msg: string, args: number };

    /**
     * only allow arrays
     */
    isArray?: boolean | { msg: string, args: boolean };

    /**
     * check for valid credit card numbers
     */
    isCreditCard?: boolean | { msg: string, args: boolean };

    /**
     * custom validations are also possible
     *
     * Implementation notes :
     *
     * We can't enforce any other method to be a function, so :
     *
     * ```typescript
     * [name: string] : ( value : any ) => boolean;
     * ```
     *
     * doesn't work in combination with the properties above
     *
     * @see https://github.com/Microsoft/TypeScript/issues/1889
     */
    [name: string]: any;

  }

  /**
   * Interface for indexes property in DefineOptions
   */
  export interface DefineIndexesOptions<TInstance extends Instance> {

    /**
     * The name of the index. Defaults to model name + _ + fields concatenated
     */
    name?: string,

    /**
     * Index type. Only used by mysql. One of `UNIQUE`, `FULLTEXT` and `SPATIAL`
     */
    index?: string,

    /**
     * The method to create the index by (`USING` statement in SQL). BTREE and HASH are supported by mysql and
     * postgres, and postgres additionally supports GIST and GIN.
     */
    method?: string,

    /**
     * Should the index by unique? Can also be triggered by setting type to `UNIQUE`
     *
     * Defaults to false
     */
    unique?: boolean,

    /**
     * PostgreSQL will build the index without taking any write locks. Postgres only
     *
     * Defaults to false
     */
    concurrently?: boolean,

    /**
     * An array of the fields to index. Each field can either be a string containing the name of the field,
     * a sequelize object (e.g `sequelize.fn`), or an object with the following attributes: `attribute`
     * (field name), `length` (create a prefix index of length chars), `order` (the direction the column
     * should be sorted in), `collate` (the collation (sort order) for the column)
     */
    fields?: Array<keyof TInstance | { attribute: keyof TInstance, length: number, order: string, collate: string }>

  }

  /**
   * Interface for name property in DefineOptions
   */
  export interface DefineNameOptions {

    /**
     * Singular model name
     */
    singular?: string,

    /**
     * Plural model name
     */
    plural?: string,

  }

  /**
   * Interface for getterMethods in DefineOptions
   *
   * @see DefineOptions
   */
  export type DefineGetterMethodsOptions<TInstance extends Instance> = {
    [K in keyof TInstance]: () => TInstance[K];
  }

  /**
   * Interface for setterMethods in DefineOptions
   *
   * @see DefineOptions
   */
  export type DefineSetterMethodsOptions<TInstance extends Instance> = {
    [K in keyof TInstance]: (val: TInstance[K]) => void;
  }

  /**
   * Interface for Define Scope Options
   *
   * @see DefineOptions
   */
  export interface DefineScopeOptions<TModel extends Model<TInstance>, TInstance extends Instance> {

    /**
     * Name of the scope and it's query
     */
    [scopeName: string]: FindOptions<TModel, TInstance> | ((...args: any[]) => FindOptions<TModel, TInstance>);

  }

  /**
   * Options for model definition
   *
   * @see Sequelize.define
   */
  export interface DefineOptions<TModel extends Model<TInstance>, TInstance extends Instance> {

    /**
     * Define the default search scope to use for this model. Scopes have the same form as the options passed to
     * find / findAll.
     */
    defaultScope?: FindOptions<TModel, TInstance>;

    /**
     * More scopes, defined in the same way as defaultScope above. See `Model.scope` for more information about
     * how scopes are defined, and what you can do with them
     */
    scopes?: DefineScopeOptions<TModel, TInstance>;

    /**
     * Don't persits null values. This means that all columns with null values will not be saved.
     */
    omitNull?: boolean;

    /**
     * Adds createdAt and updatedAt timestamps to the model. Default true.
     */
    timestamps?: boolean;

    /**
     * Calling destroy will not delete the model, but instead set a deletedAt timestamp if this is true. Needs
     * timestamps=true to work. Default false.
     */
    paranoid?: boolean;

    /**
     * Converts all camelCased columns to underscored if true. Default false.
     */
    underscored?: boolean;

    /**
     * Converts camelCased model names to underscored tablenames if true. Default false.
     */
    underscoredAll?: boolean;

    /**
     * Indicates if the model's table has a trigger associated with it. Default false.
     */
    hasTrigger?: boolean;

    /**
     * If freezeTableName is true, sequelize will not try to alter the DAO name to get the table name.
     * Otherwise, the dao name will be pluralized. Default false.
     */
    freezeTableName?: boolean;

    /**
     * An object with two attributes, `singular` and `plural`, which are used when this model is associated to
     * others.
     */
    name?: DefineNameOptions;

    /**
     * Indexes for the provided database table
     */
    indexes?: DefineIndexesOptions<TInstance>[];

    /**
     * Override the name of the createdAt column if a string is provided, or disable it if false. Timestamps
     * must be true. Not affected by underscored setting.
     */
    createdAt?: string | boolean;

    /**
     * Override the name of the deletedAt column if a string is provided, or disable it if false. Timestamps
     * must be true. Not affected by underscored setting.
     */
    deletedAt?: string | boolean;

    /**
     * Override the name of the updatedAt column if a string is provided, or disable it if false. Timestamps
     * must be true. Not affected by underscored setting.
     */
    updatedAt?: string | boolean;

    /**
     * Defaults to pluralized model name, unless freezeTableName is true, in which case it uses model name
     * verbatim
     */
    tableName?: string;

    /**
     * Provide getter functions that work like those defined per column. If you provide a getter method with
     * the
     * same name as a column, it will be used to access the value of that column. If you provide a name that
     * does not match a column, this function will act as a virtual getter, that can fetch multiple other
     * values
     */
    getterMethods?: DefineGetterMethodsOptions<TInstance>;

    /**
     * Provide setter functions that work like those defined per column. If you provide a setter method with
     * the
     * same name as a column, it will be used to update the value of that column. If you provide a name that
     * does not match a column, this function will act as a virtual setter, that can act on and set other
     * values, but will not be persisted
     */
    setterMethods?: DefineSetterMethodsOptions<TInstance>;

    /**
     * Provide functions that are added to each instance (DAO). If you override methods provided by sequelize,
     * you can access the original method using `this.constructor.super_.prototype`, e.g.
     * `this.constructor.super_.prototype.toJSON.apply(this, arguments)`
     */
    instanceMethods?: { [K in keyof TInstance]: (this: TInstance, ...args: any[]) => any };

    /**
     * Provide functions that are added to the model (Model). If you override methods provided by sequelize,
     * you can access the original method using `this.constructor.prototype`, e.g.
     * `this.constructor.prototype.find.apply(this, arguments)`
     */
    classMethods?: { [K in keyof TModel]: (this: TModel, ...args: any[]) => any };

    schema?: string;

    /**
     * You can also change the database engine, e.g. to MyISAM. InnoDB is the default.
     */
    engine?: string;

    charset?: string;

    /**
     * Finaly you can specify a comment for the table in MySQL and PG
     */
    comment?: string;

    collate?: string;

    /**
     * Set the initial AUTO_INCREMENT value for the table in MySQL.
     */
    initialAutoIncrement?: string;

    /**
     * An object of hook function that are called before and after certain lifecycle events.
     * The possible hooks are: beforeValidate, afterValidate, beforeBulkCreate, beforeBulkDestroy,
     * beforeBulkUpdate, beforeCreate, beforeDestroy, beforeUpdate, afterCreate, afterDestroy, afterUpdate,
     * afterBulkCreate, afterBulkDestory and afterBulkUpdate. See Hooks for more information about hook
     * functions and their signatures. Each property can either be a function, or an array of functions.
     */
    hooks?: HooksOptions<TModel, TInstance>;

    /**
     * An object of model wide validations. Validations have access to all model values via `this`. If the
     * validator function takes an argument, it is asumed to be async, and is called with a callback that
     * accepts an optional error.
     */
    validate?: DefineValidateOptions;

  }

  /**
   * Sync Options
   *
   * @see Sequelize.sync
   */
  export interface SyncOptions {

    /**
     * If force is true, each DAO will do DROP TABLE IF EXISTS ..., before it tries to create its own table
     */
    force?: boolean;

    /**
     * Match a regex against the database name before syncing, a safety check for cases where force: true is
     * used in tests but not live code
     */
    match?: RegExp;

    /**
     * A function that logs sql queries, or false for no logging
     */
    logging?: Function | boolean;

    /**
     * The schema that the tables should be created in. This can be overriden for each table in sequelize.define
     */
    schema?: string;

  }

  export interface SetOptions { }

  /**
   * Connection Pool options
   *
   * @see Options
   */
  export interface PoolOptions {

    /**
     * Maximum connections of the pool
     */
    maxConnections?: number;

    /**
     * Minimum connections of the pool
     */
    minConnections?: number;

    /**
     * The maximum time, in milliseconds, that a connection can be idle before being released.
     */
    maxIdleTime?: number;

    /**
     * A function that validates a connection. Called with client. The default function checks that client is an
     * object, and that its state is not disconnected.
     */
    validateConnection?: (client?: any) => boolean;

  }

  /**
   * Interface for replication Options in the sequelize constructor
   *
   * @see Options
   */
  export interface ReplicationOptions {

    read?: {
      host?: string,
      port?: string | number,
      username?: string,
      password?: string,
      database?: string
    }

    write?: {
      host?: string,
      port?: string | number,
      username?: string,
      password?: string,
      database?: string
    }

  }

  /**
   * Options for the constructor of Sequelize main class
   */
  export interface Options {

    /**
     * The dialect of the database you are connecting to. One of mysql, postgres, sqlite, mariadb and mssql.
     *
     * Defaults to 'mysql'
     */
    dialect?: string;

    /**
     * If specified, load the dialect library from this path. For example, if you want to use pg.js instead of
     * pg when connecting to a pg database, you should specify 'pg.js' here
     */
    dialectModulePath?: string;

    /**
     * An object of additional options, which are passed directly to the connection library
     */
    dialectOptions?: Object;

    /**
     * Only used by sqlite.
     *
     * Defaults to ':memory:'
     */
    storage?: string;

    /**
     * The host of the relational database.
     *
     * Defaults to 'localhost'
     */
    host?: string;

    /**
     * The port of the relational database.
     */
    port?: number;

    /**
     * The protocol of the relational database.
     *
     * Defaults to 'tcp'
     */
    protocol?: string;

    /**
     * Default options for model definitions. See sequelize.define for options
     */
    define?: DefineOptions<any, any>;

    /**
     * Default options for sequelize.query
     */
    query?: QueryOptions;

    /**
     * Default options for sequelize.set
     */
    set?: InstanceSetOptions;

    /**
     * Default options for sequelize.sync
     */
    sync?: SyncOptions;

    /**
     * The timezone used when converting a date from the database into a JavaScript date. The timezone is also
     * used to SET TIMEZONE when connecting to the server, to ensure that the result of NOW, CURRENT_TIMESTAMP
     * and other time related functions have in the right timezone. For best cross platform performance use the
     * format
     * +/-HH:MM. Will also accept string versions of timezones used by moment.js (e.g. 'America/Los_Angeles');
     * this is useful to capture daylight savings time changes.
     *
     * Defaults to '+00:00'
     */
    timezone?: string;

    /**
     * A function that gets executed everytime Sequelize would log something.
     *
     * Defaults to console.log
     */
    logging?: boolean | Function;

    /**
     * A flag that defines if null values should be passed to SQL queries or not.
     *
     * Defaults to false
     */
    omitNull?: boolean;

    /**
     * A flag that defines if native library shall be used or not. Currently only has an effect for postgres
     *
     * Defaults to false
     */
    native?: boolean;

    /**
     * Use read / write replication. To enable replication, pass an object, with two properties, read and write.
     * Write should be an object (a single server for handling writes), and read an array of object (several
     * servers to handle reads). Each read/write server can have the following properties: `host`, `port`,
     * `username`, `password`, `database`
     *
     * Defaults to false
     */
    replication?: ReplicationOptions;

    /**
     * Connection pool options
     */
    pool?: PoolOptions;

    /**
     * Set to `false` to make table names and attributes case-insensitive on Postgres and skip double quoting of
     * them.
     *
     * Defaults to true
     */
    quoteIdentifiers?: boolean;

    /**
     * Set the default transaction isolation level. See `Sequelize.Transaction.ISOLATION_LEVELS` for possible
     * options.
     *
     * Defaults to 'REPEATABLE_READ'
     */
    isolationLevel?: string;

  }

  /**
   * Sequelize methods that are available both for the static and the instance class of Sequelize
   */
  export interface SequelizeStaticAndInstance extends Errors {

    /**
     * A reference to sequelize utilities. Most users will not need to use these utils directly. However, you
     * might want to use `Sequelize.Utils._`, which is a reference to the lodash library, if you don't already
     * have it imported in your project.
     */
    Utils: typeof Utils;

    /**
     * A modified version of bluebird promises, that allows listening for sql events
     */
    Promise: typeof SequelizePromise;

    /**
     * Available query types for use with `sequelize.query`
     */
    QueryTypes: QueryTypes;

    /**
     * Exposes the validator.js object, so you can extend it with custom validation functions.
     * The validator is exposed both on the instance, and on the constructor.
     */
    Validator: Validator;

    /**
     * A Model represents a table in the database. Sometimes you might also see it referred to as model, or
     * simply as factory. This class should not be instantiated directly, it is created using sequelize.define,
     * and already created models can be loaded using sequelize.import
     */
    Model: ModelStatic<Instance>;

    /**
     * A reference to the sequelize transaction class. Use this to access isolationLevels when creating a
     * transaction
     */
    Transaction: TransactionStatic;

    /**
     * A reference to the deferrable collection. Use this to access the different deferrable options.
     */
    Deferrable: Deferrable;

    /**
     * A reference to the sequelize instance class.
     */
    Instance: {
      new (): Instance;
      prototype: Instance;
    }

    /**
     * Creates a object representing a database function. This can be used in search queries, both in where and
     * order parts, and as default values in column definitions. If you want to refer to columns in your
     * function, you should use `sequelize.col`, so that the columns are properly interpreted as columns and
     * not a strings.
     *
     * Convert a user's username to upper case
     * ```js
     * instance.updateAttributes({
     *   username: self.sequelize.fn('upper', self.sequelize.col('username'))
     * })
     * ```
     * @param fn The function you want to call
     * @param args All further arguments will be passed as arguments to the function
     */
    fn(fn: string, ...args: any[]): fn;

    /**
     * Creates a object representing a column in the DB. This is often useful in conjunction with
     * `sequelize.fn`, since raw string arguments to fn will be escaped.
     *
     * @param col The name of the column
     */
    col(col: string): col;

    /**
     * Creates a object representing a call to the cast function.
     *
     * @param val The value to cast
     * @param type The type to cast it to
     */
    cast(val: any, type: string): cast;

    /**
     * Creates a object representing a literal, i.e. something that will not be escaped.
     *
     * @param val
     */
    literal(val: any): literal;
    asIs(val: any): literal;

    /**
     * An AND query
     *
     * @param args Each argument will be joined by AND
     */
    and<TInstance extends Instance, K extends keyof TInstance>(...args: Array<WhereOperators<TInstance, K> | WhereAttributeHash<TInstance>>): AndOperator<TInstance, K>;

    /**
     * An OR query
     *
     * @param args Each argument will be joined by OR
     */
    or<TInstance extends Instance, K extends keyof TInstance>(...args: Array<WhereOperators<TInstance, K> | WhereAttributeHash<TInstance>>): OrOperator<TInstance, K>;

    /**
     * Creates an object representing nested where conditions for postgres's json data-type.
     *
     * @param conditionsOrPath A hash containing strings/numbers or other nested hash, a string using dot
     *     notation or a string using postgres json syntax.
     * @param value An optional value to compare against. Produces a string of the form "<json path> =
     *     '<value>'".
     */
    json(conditionsOrPath: string | Object, value?: string | number | boolean): json;

    /**
     * A way of specifying attr = condition.
     *
     * The attr can either be an object taken from `Model.rawAttributes` (for example `Model.rawAttributes.id`
     * or
     * `Model.rawAttributes.name`). The attribute should be defined in your model definition. The attribute can
     * also be an object from one of the sequelize utility functions (`sequelize.fn`, `sequelize.col` etc.)
     *
     * For string attributes, use the regular `{ where: { attr: something }}` syntax. If you don't want your
     * string to be escaped, use `sequelize.literal`.
     *
     * @param attr The attribute, which can be either an attribute object from `Model.rawAttributes` or a
     *     sequelize object, for example an instance of `sequelize.fn`. For simple string attributes, use the
     *     POJO syntax
     * @param comparator Comparator
     * @param logic The condition. Can be both a simply type, or a further condition (`.or`, `.and`, `.literal`
     *     etc.)
     */
    where(attr: DefineAttributeColumnOptions<any, any> | fn | col | literal, comparator: string, logic: any): where;
    where(attr: DefineAttributeColumnOptions<any, any> | fn | col | literal, logic: any): where;
    condition(attr: Object, logic: any): where;


  }

  export interface QueryOptionsTransactionRequired { }

  //
  //  Transaction
  // ~~~~~~~~~~~~~
  //
  //  https://github.com/sequelize/sequelize/blob/v3.4.1/lib/transaction.js
  //

  /**
   * The transaction object is used to identify a running transaction. It is created by calling
   * `Sequelize.transaction()`.
   *
   * To run a query under a transaction, you should pass the transaction in the options object.
   */
  export interface Transaction {

    /**
     * Possible options for row locking. Used in conjuction with `find` calls:
     *
     * @see TransactionStatic
     */
    LOCK: TransactionLock;

    /**
     * Commit the transaction
     */
    commit(): SequelizePromise<void>;

    /**
     * Rollback (abort) the transaction
     */
    rollback(): SequelizePromise<void>;

  }

  /**
   * The transaction static object
   *
   * @see Transaction
   */
  export interface TransactionStatic {

    /**
     * Isolations levels can be set per-transaction by passing `options.isolationLevel` to
     * `sequelize.transaction`. Default to `REPEATABLE_READ` but you can override the default isolation level
     * by passing
     * `options.isolationLevel` in `new Sequelize`.
     *
     * The possible isolations levels to use when starting a transaction:
     *
     * ```js
     * {
     *   READ_UNCOMMITTED: "READ UNCOMMITTED",
     *   READ_COMMITTED: "READ COMMITTED",
     *   REPEATABLE_READ: "REPEATABLE READ",
     *   SERIALIZABLE: "SERIALIZABLE"
     * }
     * ```
     *
     * Pass in the desired level as the first argument:
     *
     * ```js
     * return sequelize.transaction({
     *   isolationLevel: Sequelize.Transaction.SERIALIZABLE
     * }, function (t) {
     *
     *  // your transactions
     *
     * }).then(function(result) {
     *   // transaction has been committed. Do something after the commit if required.
     * }).catch(function(err) {
     *   // do something with the err.
     * });
     * ```
     *
     * @see ISOLATION_LEVELS
     */
    ISOLATION_LEVELS: TransactionIsolationLevels;

    /**
     * Possible options for row locking. Used in conjuction with `find` calls:
     *
     * ```js
     * t1 // is a transaction
     * t1.LOCK.UPDATE,
     * t1.LOCK.SHARE,
     * t1.LOCK.KEY_SHARE, // Postgres 9.3+ only
     * t1.LOCK.NO_KEY_UPDATE // Postgres 9.3+ only
     * ```
     *
     * Usage:
     * ```js
     * t1 // is a transaction
     * Model.findAll({
     *   where: ...,
     *   transaction: t1,
     *   lock: t1.LOCK...
     * });
     * ```
     *
     * Postgres also supports specific locks while eager loading by using OF:
     * ```js
     * UserModel.findAll({
     *   where: ...,
     *   include: [TaskModel, ...],
     *   transaction: t1,
     *   lock: {
     *     level: t1.LOCK...,
     *     of: UserModel
     *   }
     * });
     * ```
     * UserModel will be locked but TaskModel won't!
     */
    LOCK: TransactionLock;

  }

  /**
   * Isolations levels can be set per-transaction by passing `options.isolationLevel` to `sequelize.transaction`.
   * Default to `REPEATABLE_READ` but you can override the default isolation level by passing
   * `options.isolationLevel` in `new Sequelize`.
   */
  export interface TransactionIsolationLevels {
    READ_UNCOMMITTED: string; // 'READ UNCOMMITTED'
    READ_COMMITTED: string; // 'READ COMMITTED'
    REPEATABLE_READ: string; // 'REPEATABLE READ'
    SERIALIZABLE: string; // 'SERIALIZABLE'
  }

  /**
   * Possible options for row locking. Used in conjuction with `find` calls:
   */
  export interface TransactionLock {
    UPDATE: string; // 'UPDATE'
    SHARE: string; // 'SHARE'
    KEY_SHARE: string; // 'KEY SHARE'
    NO_KEY_UPDATE: string; // 'NO KEY UPDATE'
  }

  /**
   * Options provided when the transaction is created
   *
   * @see sequelize.transaction()
   */
  export interface TransactionOptions {

    autocommit?: boolean;

    /**
     *  See `Sequelize.Transaction.ISOLATION_LEVELS` for possible options
     */
    isolationLevel?: string;

    /**
     * A function that gets executed while running the query to log the sql.
     */
    logging?: Function;

  }

  //
  //  Utils
  // ~~~~~~~

  export type GroupOption = string | fn | col | (string | fn | col)[];

  export interface fn {
    clone: fnStatic;
  }

  export interface fnStatic {
    /**
     * @param fn The function you want to call
     * @param args All further arguments will be passed as arguments to the function
     */
    new (fn: string, ...args: Array<any>): fn;
  }

  export interface col {
    col: string;
  }

  export interface colStatic {
    /**
     * Creates a object representing a column in the DB. This is often useful in conjunction with
     * `sequelize.fn`, since raw string arguments to fn will be escaped.
     * @see {Sequelize#fn}
     *
     * @param col The name of the column
     */
    new (col: string): col;
  }

  export interface cast {
    val: any;
    type: string;
  }

  export interface castStatic {
    /**
     * Creates a object representing a call to the cast function.
     *
     * @param val The value to cast
     * @param type The type to cast it to
     */
    new (val: any, type: string): cast;
  }

  export interface literal {
    val: any;
  }

  export interface literalStatic {
    /**
     * Creates a object representing a literal, i.e. something that will not be escaped.
     *
     * @param val
     */
    new (val: any): literal;
  }

  export interface json {
    conditions?: Object;
    path?: string;
    value?: string | number | boolean;
  }

  export interface jsonStatic {
    /**
     * Creates an object representing nested where conditions for postgres's json data-type.
     * @see {Model#find}
     *
     * @method json
     * @param conditionsOrPath A hash containing strings/numbers or other nested hash, a string using dot
     *     notation or a string using postgres json syntax.
     * @param value An optional value to compare against. Produces a string of the form "<json path> =
     *     '<value>'".
     */
    new (conditionsOrPath: string | Object, value?: string | number | boolean): json;
  }

  export interface where {
    attribute: Object;
    comparator?: string;
    logic: string | Object;
  }

  export interface whereStatic {
    /**
     * A way of specifying attr = condition.
     *
     * The attr can either be an object taken from `Model.rawAttributes` (for example `Model.rawAttributes.id`
     * or
     * `Model.rawAttributes.name`). The attribute should be defined in your model definition. The attribute can
     * also be an object from one of the sequelize utility functions (`sequelize.fn`, `sequelize.col` etc.)
     *
     * For string attributes, use the regular `{ where: { attr: something }}` syntax. If you don't want your
     * string to be escaped, use `sequelize.literal`.
     *
     * @param attr The attribute, which can be either an attribute object from `Model.rawAttributes` or a
     *     sequelize object, for example an instance of `sequelize.fn`. For simple string attributes, use the
     *     POJO syntax
     * @param comparator Comparator
     * @param logic The condition. Can be both a simply type, or a further condition (`.or`, `.and`, `.literal`
     *     etc.)
     */
    new (attr: Object, comparator: string, logic: string | Object): where;
    new (attr: Object, logic: string | Object): where;
  }
}

export = Sequelize;

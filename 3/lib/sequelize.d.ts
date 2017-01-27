
import {QueryInterface} from './query-interface';
import {
  Model,
  CreateOptions,
  BulkCreateOptions,
  DestroyOptions,
  UpdateOptions,
  CountOptions,
  TruncateOptions,
  DropOptions,
  ModelStatic,
  WhereOperators,
  WhereAttributeHash,
  AndOperator,
  OrOperator
} from './model';
import {Validator} from './utils/validator-extras';
import {QueryTypes} from './query-types';
import {Errors} from './errors';
import {Instance, InstanceSetOptions, InstanceDestroyOptions, InstanceUpdateOptions} from './instance';
import {fn, literal, col, where, json, cast} from './utils';
import {Hooks, HooksOptions} from './hooks';
import {Deferrable} from './deferrable';
import {Promise as SequelizePromise} from './promise';
import {DataType, DataTypes as IDataTypes} from './data-types';
import * as DataTypes from './data-types';
import {Transaction, TransactionOptions, TransactionStatic} from './transaction';
import {FindOptions} from './model';
import {ValidationError} from './errors';
import Utils = require('./utils');

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
 * This is the main class, the entry point to sequelize. To use it, you just need to
 * import sequelize:
 *
 * ```js
 * var Sequelize = require('sequelize');
 * ```
 *
 * In addition to sequelize, the connection library for the dialect you want to use
 * should also be installed in your project. You don't need to import it however, as
 * sequelize will take care of that.
 */
export class Sequelize {
  /**
   * A reference to Sequelize constructor from sequelize. Useful for accessing DataTypes, Errors etc.
   */
  Sequelize: typeof Sequelize;

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
  constructor (database: string, username: string, password: string, options?: Options);
  constructor (database: string, username: string, options?: Options);

  /**
   * Instantiate sequelize with an URI
   * @name Sequelize
   * @constructor
   *
   * @param uri A full database URI
   * @param options See above for possible options
   */
  constructor (uri: string, options?: Options);

  /**
   * Returns the specified dialect.
   */
  getDialect(): string;

  /**
   * Returns an instance of QueryInterface.
   */
  getQueryInterface(): QueryInterface;

  /**
   * Define a new model, representing a table in the DB.
   *
   * The table columns are define by the hash that is given as the second argument. Each attribute of the
   * hash
   * represents a column. A short table definition might look like this:
   *
   * ```js
   * sequelize.define('modelName', {
   *     columnA: {
   *         type: Sequelize.BOOLEAN,
   *         validate: {
   *           is: ["[a-z]",'i'],        // will only allow letters
   *           max: 23,                  // only allow values <= 23
   *           isIn: {
   *             args: [['en', 'zh']],
   *             msg: "Must be English or Chinese"
   *           }
   *         },
   *         field: 'column_a'
   *         // Other attributes here
   *     },
   *     columnB: Sequelize.STRING,
   *     columnC: 'MY VERY OWN COLUMN TYPE'
   * })
   *
   * sequelize.models.modelName // The model will now be available in models under the name given to define
   * ```
   *
   * As shown above, column definitions can be either strings, a reference to one of the datatypes that are
   * predefined on the Sequelize constructor, or an object that allows you to specify both the type of the
   * column, and other attributes such as default values, foreign key constraints and custom setters and
   * getters.
   *
   * For a list of possible data types, see
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#data-types
   *
   * For more about getters and setters, see
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#getters-setters
   *
   * For more about instance and class methods, see
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#expansion-of-models
   *
   * For more about validation, see
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#validations
   *
   * @param modelName  The name of the model. The model will be stored in `sequelize.models` under this name
   * @param attributes An object, where each attribute is a column of the table. Each column can be either a
   *                   DataType, a string or a type-description object, with the properties described below:
   * @param options    These options are merged with the default define options provided to the Sequelize
   *                   constructor
   */
  define<TModel extends Model<TInstance>, TInstance extends Instance>(
    modelName: string,
    attributes: DefineAttributes<TInstance>,
    options?: DefineOptions<TModel, TInstance>
  ): TModel;

  /**
   * Fetch a Model which is already defined
   *
   * @param modelName The name of a model defined with Sequelize.define
   */
  model<TModel extends Model<Instance>>(modelName: TModel['name']): TModel;

  /**
   * Checks whether a model with the given name is defined
   *
   * @param modelName The name of a model defined with Sequelize.define
   */
  isDefined(modelName: string): boolean;

  /**
   * Imports a model defined in another file
   *
   * Imported models are cached, so multiple calls to import with the same path will not load the file
   * multiple times
   *
   * See https://github.com/sequelize/sequelize/blob/master/examples/using-multiple-model-files/Task.js for a
   * short example of how to define your models in separate files so that they can be imported by
   * sequelize.import
   *
   * @param path The path to the file that holds the model you want to import. If the part is relative, it
   *     will be resolved relatively to the calling file
   *
   * @param defineFunction An optional function that provides model definitions. Useful if you do not
   *     want to use the module root as the define function
   */
  import<TModel>(
    path: string,
    defineFunction?: (sequelize: Sequelize, dataTypes: typeof DataTypes) => TModel
  ): TModel;

  /**
   * Execute a query on the DB, with the posibility to bypass all the sequelize goodness.
   *
   * By default, the function will return two arguments: an array of results, and a metadata object,
   * containing number of affected rows etc. Use `.spread` to access the results.
   *
   * If you are running a type of query where you don't need the metadata, for example a `SELECT` query, you
   * can pass in a query type to make sequelize format the results:
   *
   * ```js
   * sequelize.query('SELECT...').spread(function (results, metadata) {
   *   // Raw query - use spread
   * });
   *
   * sequelize.query('SELECT...', { type: sequelize.QueryTypes.SELECT }).then(function (results) {
   *   // SELECT query - use then
   * })
   * ```
   *
   * @param sql
   * @param options Query options
   */
  query(sql: string | { query: string, values: Array<any> }, options?: QueryOptions): SequelizePromise<any>;

  /**
   * Execute a query which would set an environment or user variable. The variables are set per connection,
   * so this function needs a transaction.
   *
   * Only works for MySQL.
   *
   * @param variables Object with multiple variables.
   * @param options Query options.
   */
  set(variables: Object, options: QueryOptionsTransactionRequired): SequelizePromise<any>;

  /**
   * Escape value.
   *
   * @param value Value that needs to be escaped
   */
  escape(value?: string | number | Date): string;

  /**
   * Create a new database schema.
   *
   * Note,that this is a schema in the
   * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this command will do nothing.
   *
   * @param schema Name of the schema
   * @param options Options supplied
   * @param options.logging A function that logs sql queries, or false for no logging
   */
  createSchema(schema: string, options: { logging?: boolean | Function }): SequelizePromise<any>;

  /**
   * Show all defined schemas
   *
   * Note,that this is a schema in the
   * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this will show all tables.
   *
   * @param options Options supplied
   * @param options.logging A function that logs sql queries, or false for no logging
   */
  showAllSchemas(options: { logging?: boolean | Function }): SequelizePromise<any>;

  /**
   * Drop a single schema
   *
   * Note,that this is a schema in the
   * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this drop a table matching the schema name
   *
   * @param schema Name of the schema
   * @param options Options supplied
   * @param options.logging A function that logs sql queries, or false for no logging
   */
  dropSchema(schema: string, options: { logging?: boolean | Function }): SequelizePromise<any>;

  /**
   * Drop all schemas
   *
   * Note,that this is a schema in the
   * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this is the equivalent of drop all tables.
   *
   * @param options Options supplied
   * @param options.logging A function that logs sql queries, or false for no logging
   */
  dropAllSchemas(options: { logging?: boolean | Function }): SequelizePromise<any>;

  /**
   * Sync all defined models to the DB.
   *
   * @param options Sync Options
   */
  sync(options?: SyncOptions): SequelizePromise<any>;

  /**
   * Truncate all tables defined through the sequelize models. This is done
   * by calling Model.truncate() on each model.
   *
   * @param {object} [options] The options passed to Model.destroy in addition to truncate
   * @param {Boolean|function} [options.transaction]
   * @param {Boolean|function} [options.logging] A function that logs sql queries, or false for no logging
   */
  truncate(options?: TruncateOptions): SequelizePromise<any>;

  /**
   * Drop all tables defined through this sequelize instance. This is done by calling Model.drop on each model
   * @see {Model#drop} for options
   *
   * @param options The options passed to each call to Model.drop
   */
  drop(options?: DropOptions): SequelizePromise<any>;

  /**
   * Test the connection by trying to authenticate
   *
   * @param options Query Options for authentication
   */
  authenticate(options?: QueryOptions): SequelizePromise<void>;
  validate(options?: QueryOptions): SequelizePromise<ValidationError>;

  /**
   * Start a transaction. When using transactions, you should pass the transaction in the options argument
   * in order for the query to happen under that transaction
   *
   * ```js
   * sequelize.transaction().then(function (t) {
   *   return User.find(..., { transaction: t}).then(function (user) {
   *     return user.updateAttributes(..., { transaction: t});
   *   })
   *   .then(t.commit.bind(t))
   *   .catch(t.rollback.bind(t));
   * })
   * ```
   *
   * A syntax for automatically committing or rolling back based on the promise chain resolution is also
   * supported:
   *
   * ```js
   * sequelize.transaction(function (t) { // Note that we use a callback rather than a promise.then()
   *   return User.find(..., { transaction: t}).then(function (user) {
   *     return user.updateAttributes(..., { transaction: t});
   *   });
   * }).then(function () {
   *   // Commited
   * }).catch(function (err) {
   *   // Rolled back
   *   console.error(err);
   * });
   * ```
   *
   * If you have [CLS](https://github.com/othiym23/node-continuation-local-storage) enabled, the transaction
   * will automatically be passed to any query that runs witin the callback. To enable CLS, add it do your
   * project, create a namespace and set it on the sequelize constructor:
   *
   * ```js
   * var cls = require('continuation-local-storage'),
   *     ns = cls.createNamespace('....');
   * var Sequelize = require('sequelize');
   * Sequelize.cls = ns;
   * ```
   * Note, that CLS is enabled for all sequelize instances, and all instances will share the same namespace
   *
   * @param options Transaction Options
   * @param autoCallback Callback for the transaction
   */
  transaction(options: TransactionOptions, autoCallback: (t: Transaction) => PromiseLike<any>): SequelizePromise<any>;
  transaction(autoCallback: (t: Transaction) => PromiseLike<any>): SequelizePromise<any>;
  transaction(options?: TransactionOptions): SequelizePromise<Transaction>;

  /**
   * Close all connections used by this sequelize instance, and free all references so the instance can be
   * garbage collected.
   *
   * Normally this is done on process exit, so you only need to call this method if you are creating multiple
   * instances, and want to garbage collect some of them.
   */
  close(): void;

  /**
   * Returns the database version
   */
  databaseVersion(): SequelizePromise<string>;

  // ------------------------------------------ Hooks -------------------------------------------------------------

  /**
   * Add a hook to the model
   *
   * @param hookType
   * @param name Provide a name for the hook function. It can be used to remove the hook later or to order
   *     hooks based on some sort of priority system in the future.
   * @param fn The hook function
   *
   * @alias hook
   */
  addHook(hookType: string, name: string, fn: Function): typeof Sequelize;
  addHook(hookType: string, fn: Function): typeof Sequelize;
  hook(hookType: string, name: string, fn: Function): typeof Sequelize;
  hook(hookType: string, fn: Function): typeof Sequelize;

  /**
   * Remove hook from the model
   *
   * @param hookType
   * @param name
   */
  removeHook(hookType: string, name: string): typeof Sequelize;

  /**
   * Check whether the mode has any hooks of this type
   *
   * @param hookType
   *
   * @alias hasHooks
   */
  hasHook(hookType: string): boolean;
  hasHooks(hookType: string): boolean;

  /**
   * A hook that is run before validation
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  beforeValidate(name: string, fn: (instance: Instance, options: Object) => void): void;
  beforeValidate(fn: (instance: Instance, options: Object) => void): void;

  /**
   * A hook that is run after validation
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  afterValidate(name: string, fn: (instance: Instance, options: Object) => void): void;
  afterValidate(fn: (instance: Instance, options: Object) => void): void;

  /**
   * A hook that is run before creating a single instance
   *
   * @param name
   * @param fn A callback function that is called with attributes, options
   */
  beforeCreate(name: string, fn: (attributes: Instance, options: CreateOptions<Model<Instance>, Instance>) => void): void;
  beforeCreate(fn: (attributes: Instance, options: CreateOptions<Model<Instance>, Instance>) => void): void;

  /**
   * A hook that is run after creating a single instance
   *
   * @param name
   * @param fn A callback function that is called with attributes, options
   */
  afterCreate(name: string, fn: (attributes: Instance, options: CreateOptions<Model<Instance>, Instance>) => void): void;
  afterCreate(fn: (attributes: Instance, options: CreateOptions<Model<Instance>, Instance>) => void): void;

  /**
   * A hook that is run before destroying a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   * @alias beforeDelete
   */
  beforeDestroy(name: string, fn: (instance: Instance, options: InstanceDestroyOptions) => void): void;
  beforeDestroy(fn: (instance: Instance, options: InstanceDestroyOptions) => void): void;
  beforeDelete(name: string, fn: (instance: Instance, options: InstanceDestroyOptions) => void): void;
  beforeDelete(fn: (instance: Instance, options: InstanceDestroyOptions) => void): void;

  /**
   * A hook that is run after destroying a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   * @alias afterDelete
   */
  afterDestroy(name: string, fn: (instance: Instance, options: InstanceDestroyOptions) => void): void;
  afterDestroy(fn: (instance: Instance, options: InstanceDestroyOptions) => void): void;
  afterDelete(name: string, fn: (instance: Instance, options: InstanceDestroyOptions) => void): void;
  afterDelete(fn: (instance: Instance, options: InstanceDestroyOptions) => void): void;

  /**
   * A hook that is run before updating a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  beforeUpdate(name: string, fn: (instance: Instance, options: UpdateOptions<Instance>) => void): void;
  beforeUpdate(fn: (instance: Instance, options: UpdateOptions<Instance>) => void): void;

  /**
   * A hook that is run after updating a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  afterUpdate(name: string, fn: (instance: Instance, options: UpdateOptions<Instance>) => void): void;
  afterUpdate(fn: (instance: Instance, options: UpdateOptions<Instance>) => void): void;

  /**
   * A hook that is run before creating instances in bulk
   *
   * @param name
   * @param fn A callback function that is called with instances, options
   */
  beforeBulkCreate(name: string, fn: (instances: Instance[], options: BulkCreateOptions<Instance>) => void): void;
  beforeBulkCreate(fn: (instances: Instance[], options: BulkCreateOptions<Instance>) => void): void;

  /**
   * A hook that is run after creating instances in bulk
   *
   * @param name
   * @param fn A callback function that is called with instances, options
   * @name afterBulkCreate
   */
  afterBulkCreate(name: string, fn: (instances: Instance[], options: BulkCreateOptions<Instance>) => void): void;
  afterBulkCreate(fn: (instances: Instance[], options: BulkCreateOptions<Instance>) => void): void;

  /**
   * A hook that is run before destroying instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   *
   * @alias beforeBulkDelete
   */
  beforeBulkDestroy(name: string, fn: (options: BulkCreateOptions<Instance>) => void): void;
  beforeBulkDestroy(fn: (options: BulkCreateOptions<Instance>) => void): void;
  beforeBulkDelete(name: string, fn: (options: BulkCreateOptions<Instance>) => void): void;
  beforeBulkDelete(fn: (options: BulkCreateOptions<Instance>) => void): void;

  /**
   * A hook that is run after destroying instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   *
   * @alias afterBulkDelete
   */
  afterBulkDestroy(name: string, fn: (options: DestroyOptions<Instance>) => void): void;
  afterBulkDestroy(fn: (options: DestroyOptions<Instance>) => void): void;
  afterBulkDelete(name: string, fn: (options: DestroyOptions<Instance>) => void): void;
  afterBulkDelete(fn: (options: DestroyOptions<Instance>) => void): void;

  /**
   * A hook that is run after updating instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeBulkUpdate(name: string, fn: (options: UpdateOptions<Instance>) => void): void;
  beforeBulkUpdate(fn: (options: UpdateOptions<Instance>) => void): void;

  /**
   * A hook that is run after updating instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  afterBulkUpdate(name: string, fn: (options: UpdateOptions<Instance>) => void): void;
  afterBulkUpdate(fn: (options: UpdateOptions<Instance>) => void): void;

  /**
   * A hook that is run before a find (select) query
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeFind(name: string, fn: (options: FindOptions<Model<Instance>, Instance>) => void): void;
  beforeFind(fn: (options: FindOptions<Model<Instance>, Instance>) => void): void;

  /**
   * A hook that is run before a find (select) query, after any { include: {all: ...} } options are expanded
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeFindAfterExpandIncludeAll(name: string, fn: (options: FindOptions<Model<Instance>, Instance>) => void): void;
  beforeFindAfterExpandIncludeAll(fn: (options: FindOptions<Model<Instance>, Instance>) => void): void;

  /**
   * A hook that is run before a find (select) query, after all option parsing is complete
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeFindAfterOptions(name: string, fn: (options: FindOptions<Model<Instance>, Instance>) => void): void;
  beforeFindAfterOptions(fn: (options: FindOptions<Model<Instance>, Instance>) => void): void;

  /**
   * A hook that is run after a find (select) query
   *
   * @param name
   * @param fn   A callback function that is called with instance(s), options
   */
  afterFind(name: string, fn: (instancesOrInstance: Instance[] | Instance, options: FindOptions<Model<Instance>, Instance>, fn?: Function) => void): void;
  afterFind(fn: (instancesOrInstance: Instance[] | Instance, options: FindOptions<Model<Instance>, Instance>,
    fn?: Function) => void): void;

  /**
   * A hook that is run before a define call
   *
   * @param name
   * @param fn   A callback function that is called with attributes, options
   */
  beforeDefine(name: string, fn: (attributes: DefineAttributes<Instance>, options: DefineOptions<Model<Instance>, Instance>) => void): void;
  beforeDefine(fn: (attributes: DefineAttributes<Instance>, options: DefineOptions<Model<Instance>, Instance>) => void): void;

  /**
   * A hook that is run after a define call
   *
   * @param name
   * @param fn   A callback function that is called with factory
   */
  afterDefine(name: string, fn: (model: Model<Instance>) => void): void;
  afterDefine(fn: (model: Model<Instance>) => void): void;

  /**
   * A hook that is run before Sequelize() call
   *
   * @param name
   * @param fn   A callback function that is called with config, options
   */
  beforeInit(name: string, fn: (config: Object, options: Object) => void): void;
  beforeInit(fn: (config: Object, options: Object) => void): void;

  /**
   * A hook that is run after Sequelize() call
   *
   * @param name
   * @param fn   A callback function that is called with sequelize
   */
  afterInit(name: string, fn: (sequelize: Sequelize) => void): void;
  afterInit(fn: (sequelize: Sequelize) => void): void;

  /**
   * A hook that is run before sequelize.sync call
   * @param {String}   name
   * @param {Function} fn   A callback function that is called with options passed to sequelize.sync
   * @name beforeBulkSync
   */
  beforeBulkSync(name: string, fn: (options: SyncOptions) => any): void;
  beforeBulkSync(fn: (options: SyncOptions) => any): void;

  /**
   * A hook that is run after sequelize.sync call
   * @param {String}   name
   * @param {Function} fn   A callback function that is called with options passed to sequelize.sync
   * @name afterBulkSync
   */
  afterBulkSync(name: string, fn: (options: SyncOptions) => any): void;
  afterBulkSync(fn: (options: SyncOptions) => any): void;

  /**
   * A hook that is run before Model.sync call
   * @param {String}   name
   * @param {Function} fn   A callback function that is called with options passed to Model.sync
   * @name beforeSync
   */
  beforeSync(name: string, fn: (options: SyncOptions) => any): void;
  beforeSync(fn: (options: SyncOptions) => any): void;

  /**
   * A hook that is run after Model.sync call
   * @param {String}   name
   * @param {Function} fn   A callback function that is called with options passed to Model.sync
   * @name afterSync
   */
  afterSync(name: string, fn: (options: SyncOptions) => any): void;
  afterSync(fn: (options: SyncOptions) => any): void;

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
  static fn(fn: string, ...args: any[]): fn;
  fn(fn: string, ...args: any[]): fn;

  /**
   * Creates a object representing a column in the DB. This is often useful in conjunction with
   * `sequelize.fn`, since raw string arguments to fn will be escaped.
   *
   * @param col The name of the column
   */
  static col(col: string): col;
  col(col: string): col;

  /**
   * Creates a object representing a call to the cast function.
   *
   * @param val The value to cast
   * @param type The type to cast it to
   */
  static cast(val: any, type: string): cast;
  cast(val: any, type: string): cast;

  /**
   * Creates a object representing a literal, i.e. something that will not be escaped.
   *
   * @param val
   */
  static literal(val: any): literal;
  literal(val: any): literal;
  static asIs(val: any): literal;
  asIs(val: any): literal;

  /**
   * An AND query
   *
   * @param args Each argument will be joined by AND
   */
  static and<TInstance extends Instance, K extends keyof TInstance>(...args: Array<WhereOperators<TInstance, K> | WhereAttributeHash<TInstance>>): AndOperator<TInstance, K>;
  and<TInstance extends Instance, K extends keyof TInstance>(...args: Array<WhereOperators<TInstance, K> | WhereAttributeHash<TInstance>>): AndOperator<TInstance, K>;

  /**
   * An OR query
   *
   * @param args Each argument will be joined by OR
   */
  static or<TInstance extends Instance, K extends keyof TInstance>(...args: Array<WhereOperators<TInstance, K> | WhereAttributeHash<TInstance>>): OrOperator<TInstance, K>;
  or<TInstance extends Instance, K extends keyof TInstance>(...args: Array<WhereOperators<TInstance, K> | WhereAttributeHash<TInstance>>): OrOperator<TInstance, K>;

  /**
   * Creates an object representing nested where conditions for postgres's json data-type.
   *
   * @param conditionsOrPath A hash containing strings/numbers or other nested hash, a string using dot
   *     notation or a string using postgres json syntax.
   * @param value An optional value to compare against. Produces a string of the form "<json path> =
   *     '<value>'".
   */
  static json(conditionsOrPath: string | Object, value?: string | number | boolean): json;
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
  static where(attr: DefineAttributeColumnOptions<any, any> | fn | col | literal, comparator: string, logic: any): where;
  where(attr: DefineAttributeColumnOptions<any, any> | fn | col | literal, comparator: string, logic: any): where;
  static where(attr: DefineAttributeColumnOptions<any, any> | fn | col | literal, logic: any): where;
  where(attr: DefineAttributeColumnOptions<any, any> | fn | col | literal, logic: any): where;
  static condition(attr: Object, logic: any): where;
  condition(attr: Object, logic: any): where;
}

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

export interface QueryOptionsTransactionRequired { }

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

/**
 * Sequelize methods available only for the static class ( basically this is the constructor and some extends )
 */
export interface Static extends SequelizeStaticAndInstance, IDataTypes {

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

/**
 * This is the main class, the entry point to sequelize. To use it, you just need to
 * import sequelize:
 *
 * ```js
 * var Sequelize = require('sequelize');
 * ```
 *
 * In addition to sequelize, the connection library for the dialect you want to use
 * should also be installed in your project. You don't need to import it however, as
 * sequelize will take care of that.
 */
export interface Connection extends SequelizeStaticAndInstance, Hooks<any, any> {
  /**
   * A reference to Sequelize constructor from sequelize. Useful for accessing DataTypes, Errors etc.
   */
  Sequelize: Static;

  /**
   * Returns the specified dialect.
   */
  getDialect(): string;

  /**
   * Returns an instance of QueryInterface.
   */
  getQueryInterface(): QueryInterface;

  /**
   * Define a new model, representing a table in the DB.
   *
   * The table columns are define by the hash that is given as the second argument. Each attribute of the
   * hash
   * represents a column. A short table definition might look like this:
   *
   * ```js
   * sequelize.define('modelName', {
   *     columnA: {
   *         type: Sequelize.BOOLEAN,
   *         validate: {
   *           is: ["[a-z]",'i'],        // will only allow letters
   *           max: 23,                  // only allow values <= 23
   *           isIn: {
   *             args: [['en', 'zh']],
   *             msg: "Must be English or Chinese"
   *           }
   *         },
   *         field: 'column_a'
   *         // Other attributes here
   *     },
   *     columnB: Sequelize.STRING,
   *     columnC: 'MY VERY OWN COLUMN TYPE'
   * })
   *
   * sequelize.models.modelName // The model will now be available in models under the name given to define
   * ```
   *
   * As shown above, column definitions can be either strings, a reference to one of the datatypes that are
   * predefined on the Sequelize constructor, or an object that allows you to specify both the type of the
   * column, and other attributes such as default values, foreign key constraints and custom setters and
   * getters.
   *
   * For a list of possible data types, see
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#data-types
   *
   * For more about getters and setters, see
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#getters-setters
   *
   * For more about instance and class methods, see
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#expansion-of-models
   *
   * For more about validation, see
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#validations
   *
   * @param modelName  The name of the model. The model will be stored in `sequelize.models` under this name
   * @param attributes An object, where each attribute is a column of the table. Each column can be either a
   *                   DataType, a string or a type-description object, with the properties described below:
   * @param options    These options are merged with the default define options provided to the Sequelize
   *                   constructor
   */
  define<TInstance extends Instance>(modelName: string, attributes: DefineAttributes<TInstance>,
    options?: DefineOptions<Model<TInstance>, TInstance>): Model<TInstance>;

  /**
   * Fetch a Model which is already defined
   *
   * @param modelName The name of a model defined with Sequelize.define
   */
  model<TInstance extends Instance>(modelName: string): Model<TInstance>;

  /**
   * Checks whether a model with the given name is defined
   *
   * @param modelName The name of a model defined with Sequelize.define
   */
  isDefined(modelName: string): boolean;

  /**
   * Imports a model defined in another file
   *
   * Imported models are cached, so multiple calls to import with the same path will not load the file
   * multiple times
   *
   * See https://github.com/sequelize/sequelize/blob/master/examples/using-multiple-model-files/Task.js for a
   * short example of how to define your models in separate files so that they can be imported by
   * sequelize.import
   *
   * @param path The path to the file that holds the model you want to import. If the part is relative, it
   *     will be resolved relatively to the calling file
   *
   * @param defineFunction An optional function that provides model definitions. Useful if you do not
   *     want to use the module root as the define function
   */
  import<TInstance extends Instance>(
    path: string,
    defineFunction?: (sequelize: Connection, dataTypes: typeof DataTypes) => Model<TInstance>
  ): Model<TInstance>;

  /**
   * Execute a query on the DB, with the posibility to bypass all the sequelize goodness.
   *
   * By default, the function will return two arguments: an array of results, and a metadata object,
   * containing number of affected rows etc. Use `.spread` to access the results.
   *
   * If you are running a type of query where you don't need the metadata, for example a `SELECT` query, you
   * can pass in a query type to make sequelize format the results:
   *
   * ```js
   * sequelize.query('SELECT...').spread(function (results, metadata) {
   *   // Raw query - use spread
   * });
   *
   * sequelize.query('SELECT...', { type: sequelize.QueryTypes.SELECT }).then(function (results) {
   *   // SELECT query - use then
   * })
   * ```
   *
   * @param sql
   * @param options Query options
   */
  query(sql: string | { query: string, values: Array<any> }, options?: QueryOptions): SequelizePromise<any>;

  /**
   * Execute a query which would set an environment or user variable. The variables are set per connection,
   * so this function needs a transaction.
   *
   * Only works for MySQL.
   *
   * @param variables Object with multiple variables.
   * @param options Query options.
   */
  set(variables: Object, options: QueryOptionsTransactionRequired): SequelizePromise<any>;

  /**
   * Escape value.
   *
   * @param value Value that needs to be escaped
   */
  escape(value?: string | number | Date): string;

  /**
   * Create a new database schema.
   *
   * Note,that this is a schema in the
   * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this command will do nothing.
   *
   * @param schema Name of the schema
   * @param options Options supplied
   * @param options.logging A function that logs sql queries, or false for no logging
   */
  createSchema(schema: string, options: { logging?: boolean | Function }): SequelizePromise<any>;

  /**
   * Show all defined schemas
   *
   * Note,that this is a schema in the
   * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this will show all tables.
   *
   * @param options Options supplied
   * @param options.logging A function that logs sql queries, or false for no logging
   */
  showAllSchemas(options: { logging?: boolean | Function }): SequelizePromise<any>;

  /**
   * Drop a single schema
   *
   * Note,that this is a schema in the
   * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this drop a table matching the schema name
   *
   * @param schema Name of the schema
   * @param options Options supplied
   * @param options.logging A function that logs sql queries, or false for no logging
   */
  dropSchema(schema: string, options: { logging?: boolean | Function }): SequelizePromise<any>;

  /**
   * Drop all schemas
   *
   * Note,that this is a schema in the
   * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this is the equivalent of drop all tables.
   *
   * @param options Options supplied
   * @param options.logging A function that logs sql queries, or false for no logging
   */
  dropAllSchemas(options: { logging?: boolean | Function }): SequelizePromise<any>;

  /**
   * Sync all defined models to the DB.
   *
   * @param options Sync Options
   */
  sync(options?: SyncOptions): SequelizePromise<any>;

  /**
   * Truncate all tables defined through the sequelize models. This is done
   * by calling Model.truncate() on each model.
   *
   * @param {object} [options] The options passed to Model.destroy in addition to truncate
   * @param {Boolean|function} [options.transaction]
   * @param {Boolean|function} [options.logging] A function that logs sql queries, or false for no logging
   */
  truncate<TInstance extends Instance>(options?: DestroyOptions<TInstance>): SequelizePromise<any>;

  /**
   * Drop all tables defined through this sequelize instance. This is done by calling Model.drop on each model
   * @see {Model#drop} for options
   *
   * @param options The options passed to each call to Model.drop
   */
  drop(options?: DropOptions): SequelizePromise<any>;

  /**
   * Test the connection by trying to authenticate
   *
   * @param options Query Options for authentication
   */
  authenticate(options?: QueryOptions): SequelizePromise<void>;
  validate(options?: QueryOptions): SequelizePromise<ValidationError>;

  /**
   * Start a transaction. When using transactions, you should pass the transaction in the options argument
   * in order for the query to happen under that transaction
   *
   * ```js
   * sequelize.transaction().then(function (t) {
   *   return User.find(..., { transaction: t}).then(function (user) {
   *     return user.updateAttributes(..., { transaction: t});
   *   })
   *   .then(t.commit.bind(t))
   *   .catch(t.rollback.bind(t));
   * })
   * ```
   *
   * A syntax for automatically committing or rolling back based on the promise chain resolution is also
   * supported:
   *
   * ```js
   * sequelize.transaction(function (t) { // Note that we use a callback rather than a promise.then()
   *   return User.find(..., { transaction: t}).then(function (user) {
   *     return user.updateAttributes(..., { transaction: t});
   *   });
   * }).then(function () {
   *   // Commited
   * }).catch(function (err) {
   *   // Rolled back
   *   console.error(err);
   * });
   * ```
   *
   * If you have [CLS](https://github.com/othiym23/node-continuation-local-storage) enabled, the transaction
   * will automatically be passed to any query that runs witin the callback. To enable CLS, add it do your
   * project, create a namespace and set it on the sequelize constructor:
   *
   * ```js
   * var cls = require('continuation-local-storage'),
   *     ns = cls.createNamespace('....');
   * var Sequelize = require('sequelize');
   * Sequelize.cls = ns;
   * ```
   * Note, that CLS is enabled for all sequelize instances, and all instances will share the same namespace
   *
   * @param options Transaction Options
   * @param autoCallback Callback for the transaction
   */
  transaction(options: TransactionOptions, autoCallback: (t: Transaction) => PromiseLike<any>): SequelizePromise<any>;
  transaction(autoCallback: (t: Transaction) => PromiseLike<any>): SequelizePromise<any>;
  transaction(options?: TransactionOptions): SequelizePromise<Transaction>;

  /**
   * Close all connections used by this sequelize instance, and free all references so the instance can be
   * garbage collected.
   *
   * Normally this is done on process exit, so you only need to call this method if you are creating multiple
   * instances, and want to garbage collect some of them.
   */
  close(): void;

  /**
   * Returns the database version
   */
  databaseVersion(): SequelizePromise<string>;

}

export default Sequelize;

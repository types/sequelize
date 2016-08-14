
import {DataType} from './data-types';
import {Literal, Json, Where, Col, Cast, Fn} from './utils';
import {Transaction, TransactionOptions} from './transaction';
import {QueryInterface, QueryOptions} from './query-interface';
import {DataTypes} from './data-types';
import {Promise} from './promise';
import {ModelManager} from './model-manager';
import {
  Model,
  ModelAttributes,
  ModelOptions,
  DestroyOptions,
  DropOptions,
  CreateOptions,
  InstanceDestroyOptions,
  UpdateOptions,
  BulkCreateOptions,
  FindOptions,
  WhereAttributeHash,
  WhereOperators,
  AndOperator,
  OrOperator
} from './model';


/**
 * Sync Options
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
  dialect?: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';

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
  define?: ModelOptions;

  /**
   * Default options for sequelize.query
   */
  query?: QueryOptions;

  /**
   * Default options for sequelize.set
   */
  set?: SetOptions;

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

export interface QueryOptionsTransactionRequired { }

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

  modelManager: ModelManager;

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
  static fn(fn: string, ...args: any[]): Fn;

  /**
   * Creates a object representing a column in the DB. This is often useful in conjunction with
   * `sequelize.fn`, since raw string arguments to fn will be escaped.
   *
   * @param col The name of the column
   */
  static col(col: string): Col;

  /**
   * Creates a object representing a call to the cast function.
   *
   * @param val The value to cast
   * @param type The type to cast it to
   */
  static cast(val: any, type: string): Cast;

  /**
   * Creates a object representing a literal, i.e. something that will not be escaped.
   *
   * @param val
   */
  static literal(val: any): Literal;
  static asIs(val: any): Literal;

  /**
   * An AND query
   *
   * @param args Each argument will be joined by AND
   */
  static and(...args: Array<WhereOperators | WhereAttributeHash>): AndOperator;

  /**
   * An OR query
   *
   * @param args Each argument will be joined by OR
   */
  static or(...args: Array<WhereOperators | WhereAttributeHash>): OrOperator;

  /**
   * Creates an object representing nested where conditions for postgres's json data-type.
   *
   * @param conditionsOrPath A hash containing strings/numbers or other nested hash, a string using dot
   *     notation or a string using postgres json syntax.
   * @param value An optional value to compare against. Produces a string of the form "<json path> =
   *     '<value>'".
   */
  static json(conditionsOrPath: string | Object, value?: string | number | boolean): Json;

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
  static where(attr: Object, comparator: string, logic: string | Object): Where;
  static where(attr: Object, logic: string | Object): Where;
  static condition(attr: Object, logic: string | Object): Where;

  // -------------------- Static Hooks ---------------------------------------------------------------------

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
  static addHook(hookType: string, name: string, fn: Function): typeof Sequelize;
  static addHook(hookType: string, fn: Function): typeof Sequelize;
  static hook(hookType: string, name: string, fn: Function): typeof Sequelize;
  static hook(hookType: string, fn: Function): typeof Sequelize;

  /**
   * Remove hook from the model
   *
   * @param hookType
   * @param name
   */
  static removeHook(hookType: string, name: string): typeof Sequelize;

  /**
   * Check whether the mode has any hooks of this type
   *
   * @param hookType
   *
   * @alias hasHooks
   */
  static hasHook(hookType: string): boolean;
  static hasHooks(hookType: string): boolean;

  /**
   * A hook that is run before validation
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  static beforeValidate(name: string, fn: (instance: Model, options: Object) => void): void;
  static beforeValidate(fn: (instance: Model, options: Object) => void): void;

  /**
   * A hook that is run after validation
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  static afterValidate(name: string,
    fn: (instance: Model, options: Object) => void): void;
  static afterValidate(fn: (instance: Model, options: Object) => void): void;

  /**
   * A hook that is run before creating a single instance
   *
   * @param name
   * @param fn A callback function that is called with attributes, options
   */
  static beforeCreate(name: string, fn: (attributes: Model, options: CreateOptions) => void): void;
  static beforeCreate(fn: (attributes: Model, options: CreateOptions) => void): void;

  /**
   * A hook that is run after creating a single instance
   *
   * @param name
   * @param fn A callback function that is called with attributes, options
   */
  static afterCreate(name: string, fn: (attributes: Model, options: CreateOptions) => void): void;
  static afterCreate(fn: (attributes: Model, options: CreateOptions) => void): void;

  /**
   * A hook that is run before destroying a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   * @alias beforeDelete
   */
  static beforeDestroy(name: string, fn: (instance: Model, options: InstanceDestroyOptions) => void): void;
  static beforeDestroy(fn: (instance: Model, options: InstanceDestroyOptions) => void): void;
  static beforeDelete(name: string, fn: (instance: Model, options: InstanceDestroyOptions) => void): void;
  static beforeDelete(fn: (instance: Model, options: InstanceDestroyOptions) => void): void;

  /**
   * A hook that is run after destroying a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   * @alias afterDelete
   */
  static afterDestroy(name: string, fn: (instance: Model, options: InstanceDestroyOptions) => void): void;
  static afterDestroy(fn: (instance: Model, options: InstanceDestroyOptions) => void): void;
  static afterDelete(name: string, fn: (instance: Model, options: InstanceDestroyOptions) => void): void;
  static afterDelete(fn: (instance: Model, options: InstanceDestroyOptions) => void): void;

  /**
   * A hook that is run before updating a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  static beforeUpdate(name: string,
    fn: (instance: Model, options: UpdateOptions) => void): void;
  static beforeUpdate(fn: (instance: Model, options: UpdateOptions) => void): void;

  /**
   * A hook that is run after updating a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  static afterUpdate(name: string, fn: (instance: Model, options: UpdateOptions) => void): void;
  static afterUpdate(fn: (instance: Model, options: UpdateOptions) => void): void;

  /**
   * A hook that is run before creating instances in bulk
   *
   * @param name
   * @param fn A callback function that is called with instances, options
   */
  static beforeBulkCreate(name: string, fn: (instances: Model[], options: BulkCreateOptions) => void): void;
  static beforeBulkCreate(fn: (instances: Model[], options: BulkCreateOptions) => void): void;

  /**
   * A hook that is run after creating instances in bulk
   *
   * @param name
   * @param fn A callback function that is called with instances, options
   * @name afterBulkCreate
   */
  static afterBulkCreate(name: string, fn: (instances: Model[], options: BulkCreateOptions) => void): void;
  static afterBulkCreate(fn: (instances: Model[], options: BulkCreateOptions) => void): void;

  /**
   * A hook that is run before destroying instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   *
   * @alias beforeBulkDelete
   */
  static beforeBulkDestroy(name: string, fn: (options: BulkCreateOptions) => void): void;
  static beforeBulkDestroy(fn: (options: BulkCreateOptions) => void): void;
  static beforeBulkDelete(name: string, fn: (options: BulkCreateOptions) => void): void;
  static beforeBulkDelete(fn: (options: BulkCreateOptions) => void): void;

  /**
   * A hook that is run after destroying instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   *
   * @alias afterBulkDelete
   */
  static afterBulkDestroy(name: string, fn: (options: DestroyOptions) => void): void;
  static afterBulkDestroy(fn: (options: DestroyOptions) => void): void;
  static afterBulkDelete(name: string, fn: (options: DestroyOptions) => void): void;
  static afterBulkDelete(fn: (options: DestroyOptions) => void): void;

  /**
   * A hook that is run after updating instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  static beforeBulkUpdate(name: string, fn: (options: UpdateOptions) => void): void;
  static beforeBulkUpdate(fn: (options: UpdateOptions) => void): void;

  /**
   * A hook that is run after updating instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  static afterBulkUpdate(name: string, fn: (options: UpdateOptions) => void): void;
  static afterBulkUpdate(fn: (options: UpdateOptions) => void): void;

  /**
   * A hook that is run before a find (select) query
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  static beforeFind(name: string, fn: (options: FindOptions) => void): void;
  static beforeFind(fn: (options: FindOptions) => void): void;

  /**
   * A hook that is run before a find (select) query, after any { include: {all: ...} } options are expanded
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  static beforeFindAfterExpandIncludeAll(name: string,
    fn: (options: FindOptions) => void): void;
  static beforeFindAfterExpandIncludeAll(fn: (options: FindOptions) => void): void;

  /**
   * A hook that is run before a find (select) query, after all option parsing is complete
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  static beforeFindAfterOptions(name: string, fn: (options: FindOptions) => void): void;
  static beforeFindAfterOptions(fn: (options: FindOptions) => void): void;

  /**
   * A hook that is run after a find (select) query
   *
   * @param name
   * @param fn   A callback function that is called with instance(s), options
   */
  static afterFind(name: string, fn: (instancesOrInstance: Model[] | Model, options: FindOptions,
    fn?: Function) => void): void;
  static afterFind(fn: (instancesOrInstance: Model[] | Model, options: FindOptions,
    fn?: Function) => void): void;

  /**
   * A hook that is run before a define call
   *
   * @param name
   * @param fn   A callback function that is called with attributes, options
   */
  static beforeDefine(name: string, fn: (attributes: ModelAttributes, options: ModelOptions) => void): void;
  static beforeDefine(fn: (attributes: ModelAttributes, options: ModelOptions) => void): void;

  /**
   * A hook that is run after a define call
   *
   * @param name
   * @param fn   A callback function that is called with factory
   */
  static afterDefine(name: string, fn: (model: typeof Model) => void): void;
  static afterDefine(fn: (model: typeof Model) => void): void;

  /**
   * A hook that is run before Sequelize() call
   *
   * @param name
   * @param fn   A callback function that is called with config, options
   */
  static beforeInit(name: string, fn: (config: Object, options: Object) => void): void;
  static beforeInit(fn: (config: Object, options: Object) => void): void;

  /**
   * A hook that is run after Sequelize() call
   *
   * @param name
   * @param fn   A callback function that is called with sequelize
   */
  static afterInit(name: string, fn: (sequelize: Sequelize) => void): void;
  static afterInit(fn: (sequelize: Sequelize) => void): void;

  /**
   * A hook that is run before sequelize.sync call
   * @param {String}   name
   * @param {Function} fn   A callback function that is called with options passed to sequelize.sync
   * @name beforeBulkSync
   */
  static beforeBulkSync(name: string, fn: (options: SyncOptions) => any): void;
  static beforeBulkSync(fn: (options: SyncOptions) => any): void;

  /**
   * A hook that is run after sequelize.sync call
   * @param {String}   name
   * @param {Function} fn   A callback function that is called with options passed to sequelize.sync
   * @name afterBulkSync
   */
  static afterBulkSync(name: string, fn: (options: SyncOptions) => any): void;
  static afterBulkSync(fn: (options: SyncOptions) => any): void;

  /**
   * A hook that is run before Model.sync call
   * @param {String}   name
   * @param {Function} fn   A callback function that is called with options passed to Model.sync
   * @name beforeSync
   */
  static beforeSync(name: string, fn: (options: SyncOptions) => any): void;
  static beforeSync(fn: (options: SyncOptions) => any): void;

  /**
   * A hook that is run after Model.sync call
   * @param {String}   name
   * @param {Function} fn   A callback function that is called with options passed to Model.sync
   * @name afterSync
   */
  static afterSync(name: string, fn: (options: SyncOptions) => any): void;
  static afterSync(fn: (options: SyncOptions) => any): void;

  // --------------------------- instance hooks -----------------------------------------------------------

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
  beforeValidate(name: string, fn: (instance: Model, options: Object) => void): void;
  beforeValidate(fn: (instance: Model, options: Object) => void): void;

  /**
   * A hook that is run after validation
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  afterValidate(name: string,
    fn: (instance: Model, options: Object) => void): void;
  afterValidate(fn: (instance: Model, options: Object) => void): void;

  /**
   * A hook that is run before creating a single instance
   *
   * @param name
   * @param fn A callback function that is called with attributes, options
   */
  beforeCreate(name: string, fn: (attributes: Model, options: CreateOptions) => void): void;
  beforeCreate(fn: (attributes: Model, options: CreateOptions) => void): void;

  /**
   * A hook that is run after creating a single instance
   *
   * @param name
   * @param fn A callback function that is called with attributes, options
   */
  afterCreate(name: string, fn: (attributes: Model, options: CreateOptions) => void): void;
  afterCreate(fn: (attributes: Model, options: CreateOptions) => void): void;

  /**
   * A hook that is run before destroying a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   * @alias beforeDelete
   */
  beforeDestroy(name: string, fn: (instance: Model, options: InstanceDestroyOptions) => void): void;
  beforeDestroy(fn: (instance: Model, options: InstanceDestroyOptions) => void): void;
  beforeDelete(name: string, fn: (instance: Model, options: InstanceDestroyOptions) => void): void;
  beforeDelete(fn: (instance: Model, options: InstanceDestroyOptions) => void): void;

  /**
   * A hook that is run after destroying a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   * @alias afterDelete
   */
  afterDestroy(name: string, fn: (instance: Model, options: InstanceDestroyOptions) => void): void;
  afterDestroy(fn: (instance: Model, options: InstanceDestroyOptions) => void): void;
  afterDelete(name: string, fn: (instance: Model, options: InstanceDestroyOptions) => void): void;
  afterDelete(fn: (instance: Model, options: InstanceDestroyOptions) => void): void;

  /**
   * A hook that is run before updating a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  beforeUpdate(name: string,
    fn: (instance: Model, options: UpdateOptions) => void): void;
  beforeUpdate(fn: (instance: Model, options: UpdateOptions) => void): void;

  /**
   * A hook that is run after updating a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  afterUpdate(name: string, fn: (instance: Model, options: UpdateOptions) => void): void;
  afterUpdate(fn: (instance: Model, options: UpdateOptions) => void): void;

  /**
   * A hook that is run before creating instances in bulk
   *
   * @param name
   * @param fn A callback function that is called with instances, options
   */
  beforeBulkCreate(name: string, fn: (instances: Model[], options: BulkCreateOptions) => void): void;
  beforeBulkCreate(fn: (instances: Model[], options: BulkCreateOptions) => void): void;

  /**
   * A hook that is run after creating instances in bulk
   *
   * @param name
   * @param fn A callback function that is called with instances, options
   * @name afterBulkCreate
   */
  afterBulkCreate(name: string, fn: (instances: Model[], options: BulkCreateOptions) => void): void;
  afterBulkCreate(fn: (instances: Model[], options: BulkCreateOptions) => void): void;

  /**
   * A hook that is run before destroying instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   *
   * @alias beforeBulkDelete
   */
  beforeBulkDestroy(name: string, fn: (options: BulkCreateOptions) => void): void;
  beforeBulkDestroy(fn: (options: BulkCreateOptions) => void): void;
  beforeBulkDelete(name: string, fn: (options: BulkCreateOptions) => void): void;
  beforeBulkDelete(fn: (options: BulkCreateOptions) => void): void;

  /**
   * A hook that is run after destroying instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   *
   * @alias afterBulkDelete
   */
  afterBulkDestroy(name: string, fn: (options: DestroyOptions) => void): void;
  afterBulkDestroy(fn: (options: DestroyOptions) => void): void;
  afterBulkDelete(name: string, fn: (options: DestroyOptions) => void): void;
  afterBulkDelete(fn: (options: DestroyOptions) => void): void;

  /**
   * A hook that is run after updating instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeBulkUpdate(name: string, fn: (options: UpdateOptions) => void): void;
  beforeBulkUpdate(fn: (options: UpdateOptions) => void): void;

  /**
   * A hook that is run after updating instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  afterBulkUpdate(name: string, fn: (options: UpdateOptions) => void): void;
  afterBulkUpdate(fn: (options: UpdateOptions) => void): void;

  /**
   * A hook that is run before a find (select) query
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeFind(name: string, fn: (options: FindOptions) => void): void;
  beforeFind(fn: (options: FindOptions) => void): void;

  /**
   * A hook that is run before a find (select) query, after any { include: {all: ...} } options are expanded
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeFindAfterExpandIncludeAll(name: string,
    fn: (options: FindOptions) => void): void;
  beforeFindAfterExpandIncludeAll(fn: (options: FindOptions) => void): void;

  /**
   * A hook that is run before a find (select) query, after all option parsing is complete
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeFindAfterOptions(name: string, fn: (options: FindOptions) => void): void;
  beforeFindAfterOptions(fn: (options: FindOptions) => void): void;

  /**
   * A hook that is run after a find (select) query
   *
   * @param name
   * @param fn   A callback function that is called with instance(s), options
   */
  afterFind(name: string, fn: (instancesOrInstance: Model[] | Model, options: FindOptions,
    fn?: Function) => void): void;
  afterFind(fn: (instancesOrInstance: Model[] | Model, options: FindOptions,
    fn?: Function) => void): void;

  /**
   * A hook that is run before a define call
   *
   * @param name
   * @param fn   A callback function that is called with attributes, options
   */
  beforeDefine(name: string, fn: (attributes: ModelAttributes, options: ModelOptions) => void): void;
  beforeDefine(fn: (attributes: ModelAttributes, options: ModelOptions) => void): void;

  /**
   * A hook that is run after a define call
   *
   * @param name
   * @param fn   A callback function that is called with factory
   */
  afterDefine(name: string, fn: (model: typeof Model) => void): void;
  afterDefine(fn: (model: typeof Model) => void): void;

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
  constructor(database: string, username: string, password: string, options?: Options);
  constructor(database: string, username: string, options?: Options);

  /**
   * Instantiate sequelize with an URI
   * @name Sequelize
   * @constructor
   *
   * @param uri A full database URI
   * @param options See above for possible options
   */
  constructor(uri: string, options?: Options);

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
  define<TModel>(modelName: string, attributes: ModelAttributes, options?: ModelOptions): TModel;

  /**
   * Fetch a Model which is already defined
   *
   * @param modelName The name of a model defined with Sequelize.define
   */
  model(modelName: string): typeof Model;

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
  import<T extends typeof Model>(
    path: string,
    defineFunction?: (sequelize: Sequelize, dataTypes: DataTypes) => T
  ): T;

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
  query(sql: string | { query: string, values: Array<any> }, options?: QueryOptions): Promise<any>;

  /**
   * Execute a query which would set an environment or user variable. The variables are set per connection,
   * so this function needs a transaction.
   *
   * Only works for MySQL.
   *
   * @param variables Object with multiple variables.
   * @param options Query options.
   */
  set(variables: Object, options: QueryOptionsTransactionRequired): Promise<any>;

  /**
   * Escape value.
   *
   * @param value Value that needs to be escaped
   */
  escape(value: string | number | Date): string;

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
  createSchema(schema: string, options: { logging?: boolean | Function }): Promise<any>;

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
  showAllSchemas(options: { logging?: boolean | Function }): Promise<any>;

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
  dropSchema(schema: string, options: { logging?: boolean | Function }): Promise<any>;

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
  dropAllSchemas(options: { logging?: boolean | Function }): Promise<any>;

  /**
   * Sync all defined models to the DB.
   *
   * @param options Sync Options
   */
  sync(options?: SyncOptions): Promise<any>;

  /**
   * Truncate all tables defined through the sequelize models. This is done
   * by calling Model.truncate() on each model.
   *
   * @param {object} [options] The options passed to Model.destroy in addition to truncate
   * @param {Boolean|function} [options.transaction]
   * @param {Boolean|function} [options.logging] A function that logs sql queries, or false for no logging
   */
  truncate(options?: DestroyOptions): Promise<any>;

  /**
   * Drop all tables defined through this sequelize instance. This is done by calling Model.drop on each model
   *
   * @param options The options passed to each call to Model.drop
   */
  drop(options?: DropOptions): Promise<any>;

  /**
   * Test the connection by trying to authenticate
   *
   * @param options Query Options for authentication
   */
  authenticate(options?: QueryOptions): Promise<void>;
  validate(options?: QueryOptions): Promise<void>;

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
  transaction(options: TransactionOptions, autoCallback: (t: Transaction) => PromiseLike<any>): Promise<any>;
  transaction(autoCallback: (t: Transaction) => PromiseLike<any>): Promise<any>;
  transaction(options?: TransactionOptions): Promise<Transaction>;

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
  databaseVersion(): Promise<string>;

}

export * from './model';
export * from './transaction';
export * from './model';
export * from './data-types';
export * from './associations/index';
export * from './errors';
export {BaseError as Error} from './errors';
export {useInflection} from './utils';
export {Deferrable} from './deferrable';
export {Promise} from './promise';
export {Validator} from './utils/validator-extras';

export default Sequelize;

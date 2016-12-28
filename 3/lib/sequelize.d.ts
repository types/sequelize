
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
declare class Sequelize {
  /**
   * A reference to Sequelize constructor from sequelize. Useful for accessing DataTypes, Errors etc.
   */
  Sequelize: typeof Sequelize;

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
    defineFunction?: (sequelize: Connection, dataTypes: DataTypes) => TModel
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
  afterInit(name: string, fn: (sequelize: Connection) => void): void;
  afterInit(fn: (sequelize: Connection) => void): void;

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
}

export = Sequelize;

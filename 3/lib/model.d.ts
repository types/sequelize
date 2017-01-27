
import {Instance, InstanceDestroyOptions} from './instance';
import {Transaction} from './transaction';
import {DataType} from './data-types';
import {where, literal, col, fn, GroupOption} from './utils';
import {Association, HasOne, BelongsTo, HasOneOptions, BelongsToMany, BelongsToManyOptions, HasMany, HasManyOptions, BelongsToOptions} from './associations/index';
import {QueryOptions, DefineOptions, DefineAttributes, Connection, SyncOptions, DefineAttributeColumnOptions} from './sequelize';
import Promise from './promise';

/**
 * Options to pass to Model on drop
 */
export interface DropOptions {

  /**
   * Also drop all objects depending on this table, such as views. Only works in postgres
   */
  cascade?: boolean;

  /**
   * A function that gets executed while running the query to log the sql.
   */
  logging?: boolean | Function;

}

/**
 * Schema Options provided for applying a schema to a model
 */
export interface SchemaOptions {

  /**
   * The character(s) that separates the schema name from the table name
   */
  schemaDelimeter?: string,

  /**
   * A function that gets executed while running the query to log the sql.
   */
  logging?: boolean | Function;

}

/**
 * Scope Options for Model.scope
 */
export interface ScopeOptions {

  /**
   * The scope(s) to apply. Scopes can either be passed as consecutive arguments, or as an array of arguments.
   * To apply simple scopes and scope functions with no arguments, pass them as strings. For scope function,
   * pass an object, with a `method` property. The value can either be a string, if the method does not take
   * any arguments, or an array, where the first element is the name of the method, and consecutive elements
   * are arguments to that method. Pass null to remove all scopes, including the default.
   */
  method: string | Array<any>;

}

/**
 * The type accepted by every `where` option
 *
 * The `Array<string | number>` is to support string with replacements, like `['id > ?', 25]`
 */
export type WhereOptions<TInstance extends Instance> =
  WhereAttributeHash<TInstance>
  | AndOperator<TInstance, keyof TInstance>
  | OrOperator<TInstance, keyof TInstance>
  | where
  | Array<string | number>;

/**
 * Example: `$any: [2,3]` becomes `ANY ARRAY[2, 3]::INTEGER`
 *
 * _PG only_
 */
export interface AnyOperator {
  $any: Array<string | number>;
}

/** Undocumented? */
export interface AllOperator {
  $all: Array<string | number>;
}

/**
 * Operators that can be used in WhereOptions
 *
 * See http://docs.sequelizejs.com/en/v3/docs/querying/#operators
 */
export interface WhereOperators<TInstance extends Instance, K extends keyof TInstance> {

  /**
   * Example: `$any: [2,3]` becomes `ANY ARRAY[2, 3]::INTEGER`
   *
   * _PG only_
   */
  $any?: Array<TInstance[K]>;

  /** Example: `$gte: 6,` becomes `>= 6` */
  $gte?: TInstance[K];

  /** Example: `$lt: 10,` becomes `< 10` */
  $lt?: TInstance[K];

  /** Example: `$lte: 10,` becomes `<= 10` */
  $lte?: TInstance[K];

  /** Example: `$ne: 20,` becomes `!= 20` */
  $ne?: TInstance[K];

  /** Example: `$not: true,` becomes `IS NOT TRUE` */
  $not?: TInstance[K] | WhereOperators<TInstance, K>;

  /** Example: `$between: [6, 10],` becomes `BETWEEN 6 AND 10` */
  $between?: [TInstance[K], TInstance[K]];

  /** Example: `$in: [1, 2],` becomes `IN [1, 2]` */
  $in?: Array<TInstance[K]> | literal;

  /** Example: `$notIn: [1, 2],` becomes `NOT IN [1, 2]` */
  $notIn?: Array<TInstance[K]> | literal;

  /**
   * Examples:
   *  - `$like: '%hat',` becomes `LIKE '%hat'`
   *  - `$like: { $any: ['cat', 'hat']}` becomes `LIKE ANY ARRAY['cat', 'hat']`
   */
  $like?: string | AnyOperator | AllOperator;

  /**
   * Examples:
   *  - `$notLike: '%hat'` becomes `NOT LIKE '%hat'`
   *  - `$notLike: { $any: ['cat', 'hat']}` becomes `NOT LIKE ANY ARRAY['cat', 'hat']`
   */
  $notLike?: string | AnyOperator | AllOperator;

  /**
   * case insensitive PG only
   *
   * Examples:
   *  - `$iLike: '%hat'` becomes `ILIKE '%hat'`
   *  - `$iLike: { $any: ['cat', 'hat']}` becomes `ILIKE ANY ARRAY['cat', 'hat']`
   */
  $ilike?: string | AnyOperator | AllOperator;

  /**
   * case insensitive PG only
   *
   * Examples:
   *  - `$iLike: '%hat'` becomes `ILIKE '%hat'`
   *  - `$iLike: { $any: ['cat', 'hat']}` becomes `ILIKE ANY ARRAY['cat', 'hat']`
   */
  $iLike?: string | AnyOperator | AllOperator;

  /**
   * PG array overlap operator
   *
   * Example: `$overlap: [1, 2]` becomes `&& [1, 2]`
   */
  $overlap?: [number, number];

  /**
   * PG array contains operator
   *
   * Example: `$contains: [1, 2]` becomes `@> [1, 2]`
   */
  $contains?: any[];

  /**
   * PG array contained by operator
   *
   * Example: `$contained: [1, 2]` becomes `<@ [1, 2]`
   */
  $contained?: any[];

  /** Example: `$gt: 6,` becomes `> 6` */
  $gt?: TInstance[K];

  /**
   * PG only
   *
   * Examples:
   *  - `$notILike: '%hat'` becomes `NOT ILIKE '%hat'`
   *  - `$notLike: ['cat', 'hat']` becomes `LIKE ANY ARRAY['cat', 'hat']`
   */
  $notILike?: string | AnyOperator | AllOperator;

  /** Example: `$notBetween: [11, 15],` becomes `NOT BETWEEN 11 AND 15` */
  $notBetween?: [number, number];
}

/** Example: `$or: [{a: 5}, {a: 6}]` becomes `(a = 5 OR a = 6)` */
export interface OrOperator<TInstance extends Instance, K extends keyof TInstance> {
  $or: WhereOperators<TInstance, K> | WhereAttributeHash<TInstance> | Array<WhereOperators<TInstance, K> | WhereAttributeHash<TInstance>>;
}

/** Example: `$and: {a: 5}` becomes `AND (a = 5)` */
export interface AndOperator<TInstance extends Instance, K extends keyof TInstance> {
  $and: WhereOperators<TInstance, K> | WhereAttributeHash<TInstance> | Array<WhereOperators<TInstance, K> | WhereAttributeHash<TInstance>>;
}

/**
 * Where Geometry Options
 */
export interface WhereGeometryOptions {
  type: string;
  coordinates: Array<Array<number> | number>;
}

/**
 * A hash of attributes to describe your search.
 */
export type WhereAttributeHash<TInstance extends Instance> = {
  /**
   * Possible key values:
   * - A simple attribute name
   * - A nested key for JSON columns
   *
   *       {
   *         "meta.audio.length": {
   *           $gt: 20
   *         }
   *       }
   */
  [K in keyof TInstance]?:
    TInstance[K] // literal value
    | WhereOperators<TInstance, K>
    | col // reference another column
    | OrOperator<TInstance, K>
    | AndOperator<TInstance, K>
    | WhereGeometryOptions
    | Array<string | number>; // implicit $or;
}

/**
 * Through options for Include Options
 */
export interface IncludeThroughOptions<TThroughInstance extends Instance> {

  /**
   * Filter on the join model for belongsToMany relations
   */
  where?: WhereOptions<TThroughInstance>;

  /**
   * A list of attributes to select from the join model for belongsToMany relations
   */
  attributes?: FindAttributeOptions<TThroughInstance>;

}

export type Includeable<TSourceModel extends Model<TSourceInstance>, TSourceInstance extends Instance> =
  Model<Instance> // An associated model
  | Association<TSourceModel, Model<Instance>> // An association between the source model and an associated model
  | IncludeOptions<TSourceModel, TSourceInstance>;

/**
 * Complex include options
 */
export interface IncludeOptions<TSourceModel extends Model<TSourceInstance>, TSourceInstance extends Instance> {

  /**
   * The model you want to eagerly load
   */
  model?: TSourceModel;

  /**
   * The alias of the relation, in case the model you want to eagerly load is aliassed. For `hasOne` /
   * `belongsTo`, this should be the singular name, and for `hasMany`, it should be the plural
   */
  as?: string;

  /**
   * The association you want to eagerly load. (This can be used instead of providing a model/as pair)
   */
  association?: Association<TSourceModel, Model<Instance>>;

  /**
   * Where clauses to apply to the child models. Note that this converts the eager load to an inner join,
   * unless you explicitly set `required: false`
   */
  where?: WhereOptions<TSourceInstance>;

  /**
   * A list of attributes to select from the child model
   */
  attributes?: FindAttributeOptions<TSourceInstance>;

  /**
   * If true, converts to an inner join, which means that the parent model will only be loaded if it has any
   * matching children. True if `include.where` is set, false otherwise.
   */
  required?: boolean;

  /**
   * Limit include. Only available when setting `separate` to true.
   */
  limit?: number;

  /**
   * Run include in separate queries.
   */
  separate?: boolean;

  /**
   * Through Options
   */
  through?: IncludeThroughOptions<any>;

  /**
   * Load further nested related models
   */
  include?: Includeable<TSourceModel, TSourceInstance>[];

  /**
   * Order include. Only available when setting `separate` to true.
   */
  order?: Order<TSourceInstance>;
}

export type OrderItem<TInstance extends Instance> =
  keyof TInstance | fn | col | literal |
  [keyof TInstance | col | fn | literal, string] |
  [Model<TInstance> | { model: Model<TInstance>, as: string }, string, string] |
  [Model<TInstance>, Model<TInstance>, string, string];
export type Order<TInstance extends Instance> = string | fn | col | literal | OrderItem<TInstance>[];

export type FindAttributeOptions<TInstance extends Instance> =
  Array<keyof TInstance | [keyof TInstance | literal | fn, string]> |
  {
    exclude: Array<keyof TInstance>;
    include?: Array<keyof TInstance | [keyof TInstance | literal | fn, string]>;
  } | {
    exclude?: Array<keyof TInstance>;
    include: Array<keyof TInstance | [keyof TInstance | literal | fn, string]>;
  };

/**
 * Options that are passed to any model creating a SELECT query
 *
 * A hash of options to describe the scope of the search
 */
export interface FindOptions<TModel extends Model<TInstance>, TInstance extends Instance> {
  /**
   * A hash of attributes to describe your search. See above for examples.
   */
  where?: WhereOptions<TInstance>;

  /**
   * A list of the attributes that you want to select. To rename an attribute, you can pass an array, with
   * two elements - the first is the name of the attribute in the DB (or some kind of expression such as
   * `Sequelize.literal`, `Sequelize.fn` and so on), and the second is the name you want the attribute to
   * have in the returned instance
   */
  attributes?: FindAttributeOptions<TInstance>;

  /**
   * If true, only non-deleted records will be returned. If false, both deleted and non-deleted records will
   * be returned. Only applies if `options.paranoid` is true for the model.
   */
  paranoid?: boolean;

  /**
   * A list of associations to eagerly load using a left join. Supported is either
   * `{ include: [ Model1, Model2, ...]}` or `{ include: [{ model: Model1, as: 'Alias' }]}`.
   * If your association are set up with an `as` (eg. `X.hasMany(Y, { as: 'Z }`, you need to specify Z in
   * the as attribute when eager loading Y).
   */
  include?: Includeable<TModel, TInstance>[];

  /**
   * Specifies an ordering. If a string is provided, it will be escaped. Using an array, you can provide
   * several columns / functions to order by. Each element can be further wrapped in a two-element array. The
   * first element is the column / function to order by, the second is the direction. For example:
   * `order: [['name', 'DESC']]`. In this way the column will be escaped, but the direction will not.
   */
  order?: Order<TInstance>;

  /**
   * GROUP BY in sql
   */
  group?: GroupOption;

  /**
   * Limit the results
   */
  limit?: number;

  /**
   * Skip the results;
   */
  offset?: number;

  /**
   * Transaction to run query under
   */
  transaction?: Transaction;

  /**
   * Lock the selected rows. Possible options are transaction.LOCK.UPDATE and transaction.LOCK.SHARE.
   * Postgres also supports transaction.LOCK.KEY_SHARE, transaction.LOCK.NO_KEY_UPDATE and specific model
   * locks with joins. See [transaction.LOCK for an example](transaction#lock)
   */
  lock?: string | { level: string, of: Model<Instance> };

  /**
   * Return raw result. See sequelize.query for more information.
   */
  raw?: boolean;

  /**
   * A function that gets executed while running the query to log the sql.
   */
  logging?: boolean | Function;

  /**
   * having ?!?
   */
  having?: WhereAttributeHash<TInstance>;

}

/**
 * Options for Model.count method
 */
export interface CountOptions<TModel extends Model<TInstance>, TInstance extends Instance> {

  /**
   * A hash of search attributes.
   */
  where?: WhereOptions<TInstance>;

  /**
   * Include options. See `find` for details
   */
  include?: Includeable<TModel, TInstance>[];

  /**
   * Apply COUNT(DISTINCT(col))
   */
  distinct?: boolean;

  /**
   * Used in conjustion with `group`
   */
  attributes?: FindAttributeOptions<TInstance>;

  /**
   * GROUP BY in sql
   */
  group?: GroupOption;

  /**
   * A function that gets executed while running the query to log the sql.
   */
  logging?: boolean | Function;

  transaction?: Transaction;
}

export interface FindAndCountOptions<TModel extends Model<TInstance>, TInstance extends Instance> extends CountOptions<TModel, TInstance>, FindOptions<TModel, TInstance> { }

/**
 * Options for Model.build method
 */
export interface BuildOptions<TModel extends Model<TInstance>, TInstance extends Instance> {

  /**
   * If set to true, values will ignore field and virtual setters.
   */
  raw?: boolean;

  /**
   * Is this record new
   */
  isNewRecord?: boolean;

  /**
   * an array of include options - Used to build prefetched/included model instances. See `set`
   *
   * TODO: See set
   */
  include?: Includeable<TModel, TInstance>[];

}

/**
 * Options for Model.create method
 */
export interface CreateOptions<TModel extends Model<TInstance>, TInstance extends Instance> extends BuildOptions<TModel, TInstance> {

  /**
   * If set, only columns matching those in fields will be saved
   */
  fields?: Array<keyof TInstance>;

  /**
   * On Duplicate
   */
  onDuplicate?: string;

  /**
   * Transaction to run query under
   */
  transaction?: Transaction;

  /**
   * A function that gets executed while running the query to log the sql.
   */
  logging?: boolean | Function;

  silent?: boolean;

  returning?: boolean;
}

/**
 * Options for Model.findOrInitialize method
 */
export interface FindOrInitializeOptions<TInstance extends Instance> {

  /**
   * A hash of search attributes.
   */
  where: WhereOptions<TInstance>;

  /**
   * Default values to use if building a new instance
   */
  defaults?: Partial<TInstance>;

  /**
   * Transaction to run query under
   */
  transaction?: Transaction;

  /**
   * A function that gets executed while running the query to log the sql.
   */
  logging?: boolean | Function;

}

/**
 * Options for Model.upsert method
 */
export interface UpsertOptions<TInstance extends Instance> {
  /**
   * Run validations before the row is inserted
   */
  validate?: boolean;

  /**
   * The fields to insert / update. Defaults to all fields
   */
  fields?: Array<keyof TInstance>;

  /**
   * Transaction to run query under
   */
  transaction?: Transaction;

  /**
   * A function that gets executed while running the query to log the sql.
   */
  logging?: boolean | Function;

  /**
   * An optional parameter to specify the schema search_path (Postgres only)
   */
  searchPath?: string;

  /**
   * Print query execution time in milliseconds when logging SQL.
   */
  benchmark?: boolean;
}

/**
 * Options for Model.bulkCreate method
 */
export interface BulkCreateOptions<TInstance extends Instance> {

  /**
   * Fields to insert (defaults to all fields)
   */
  fields?: Array<keyof TInstance>;

  /**
   * Should each row be subject to validation before it is inserted. The whole insert will fail if one row
   * fails validation
   */
  validate?: boolean;

  /**
   * Run before / after bulk create hooks?
   */
  hooks?: boolean;

  /**
   * Run before / after create hooks for each individual Instance? BulkCreate hooks will still be run if
   * options.hooks is true.
   */
  individualHooks?: boolean;

  /**
   * Ignore duplicate values for primary keys? (not supported by postgres)
   *
   * Defaults to false
   */
  ignoreDuplicates?: boolean;

  /**
   * Fields to update if row key already exists (on duplicate key update)? (only supported by mysql &
   * mariadb). By default, all fields are updated.
   */
  updateOnDuplicate?: Array<string>;

  /**
   * Transaction to run query under
   */
  transaction?: Transaction;

  /**
   * A function that gets executed while running the query to log the sql.
   */
  logging?: boolean | Function;

}

/**
 * The options passed to Model.destroy in addition to truncate
 */
export interface TruncateOptions {

  /**
   * Transaction to run query under
   */
  transaction?: Transaction;

  /**
   * Only used in conjuction with TRUNCATE. Truncates  all tables that have foreign-key references to the
   * named table, or to any tables added to the group due to CASCADE.
   *
   * Defaults to false;
   */
  cascade?: boolean;

  /**
   * A function that gets executed while running the query to log the sql.
   */
  logging?: boolean | Function;

  /**
   * Run before / after bulk destroy hooks?
   */
  hooks?: boolean;

  /**
   * If set to true, destroy will SELECT all records matching the where parameter and will execute before /
   * after destroy hooks on each row
   */
  individualHooks?: boolean;

  /**
   * How many rows to delete
   */
  limit?: number;

  /**
   * Delete instead of setting deletedAt to current timestamp (only applicable if `paranoid` is enabled)
   */
  force?: boolean;

  /**
   * Only used in conjunction with `truncate`.
   * Automatically restart sequences owned by columns of the truncated table
   */
  restartIdentity?: boolean;
}

/**
 * Options used for Model.destroy
 */
export interface DestroyOptions<TInstance extends Instance> extends TruncateOptions {

  /**
   * If set to true, dialects that support it will use TRUNCATE instead of DELETE FROM. If a table is
   * truncated the where and limit options are ignored
   */
  truncate?: boolean;

  /**
   * Filter the destroy
   */
  where?: WhereOptions<TInstance>;
}

/**
 * Options for Model.restore
 */
export interface RestoreOptions<TInstance extends Instance> {

  /**
   * Filter the restore
   */
  where?: WhereOptions<TInstance>;

  /**
   * Run before / after bulk restore hooks?
   */
  hooks?: boolean;

  /**
   * If set to true, restore will find all records within the where parameter and will execute before / after
   * bulkRestore hooks on each row
   */
  individualHooks?: boolean;

  /**
   * How many rows to undelete
   */
  limit?: number;

  /**
   * A function that gets executed while running the query to log the sql.
   */
  logging?: boolean | Function;

  /**
   * Transaction to run query under
   */
  transaction?: Transaction;

}

/**
 * Options used for Model.update
 */
export interface UpdateOptions<TInstance extends Instance> {

  /**
   * Options to describe the scope of the search.
   */
  where: WhereOptions<TInstance>;

  /**
   * Fields to update (defaults to all fields)
   */
  fields?: Array<keyof TInstance>;

  /**
   * Should each row be subject to validation before it is inserted. The whole insert will fail if one row
   * fails validation.
   *
   * Defaults to true
   */
  validate?: boolean;

  /**
   * Run before / after bulk update hooks?
   *
   * Defaults to true
   */
  hooks?: boolean;

  /**
   * Whether or not to update the side effects of any virtual setters.
   *
   * Defaults to true
   */
  sideEffects?: boolean;

  /**
   * Run before / after update hooks?. If true, this will execute a SELECT followed by individual UPDATEs.
   * A select is needed, because the row data needs to be passed to the hooks
   *
   * Defaults to false
   */
  individualHooks?: boolean;

  /**
   * Return the affected rows (only for postgres)
   */
  returning?: boolean;

  /**
   * How many rows to update (only for mysql and mariadb)
   */
  limit?: number;

  /**
   * A function that gets executed while running the query to log the sql.
   */
  logging?: boolean | Function;

  /**
   * Transaction to run query under
   */
  transaction?: Transaction;

}

/**
 * Options used for Model.aggregate
 */
export interface AggregateOptions<TInstance extends Instance> extends QueryOptions {
  /** A hash of search attributes. */
  where?: WhereOptions<TInstance>;

  /**
   * The type of the result. If `field` is a field in this Model, the default will be the type of that field,
   * otherwise defaults to float.
   */
  dataType?: DataType;

  /** Applies DISTINCT to the field being aggregated over */
  distinct?: boolean;
}

export interface ModelStatic<TInstance extends Instance> {
  new (): Model<TInstance>;
  prototype: Model<TInstance>
}

export class Model<TInstance extends Instance> {

  name: string;

  /** The name of the database table */
  tableName: string;

  /**
   * The name of the primary key attribute
   */
  primaryKeyAttribute: string;

  /**
   * An object hash from alias to association object
   */
  associations: any;

  /**
   * The options that the model was initialized with
   */
  options: DefineOptions<this, TInstance>;

  /**
   * The attributes of the model
   */
  rawAttributes: { [K in keyof TInstance]: DefineAttributeColumnOptions<TInstance, TInstance[K]> };

  /**
   * The attributes of the model
   */
  attributes: { [K in keyof TInstance]: DefineAttributeColumnOptions<TInstance, TInstance[K]> };

  /**
   * Builds a new model instance.
   * @param values an object of key value pairs
   */
  new (values?: Partial<TInstance>, options?: BuildOptions<this, TInstance>): TInstance;

  Instance: {
    new (): TInstance,
    prototype: TInstance
  }

  /**
   * Remove attribute from model definition
   *
   * @param attribute
   */
  removeAttribute(attribute: string): void;

  /**
   * Sync this Model to the DB, that is create the table. Upon success, the callback will be called with the
   * model instance (this)
   */
  sync(options?: SyncOptions): Promise<this>;

  /**
   * Drop the table represented by this Model
   *
   * @param options
   */
  drop(options?: DropOptions): Promise<void>;

  /**
   * Apply a schema to this model. For postgres, this will actually place the schema in front of the table
   * name
   * - `"schema"."tableName"`, while the schema will be prepended to the table name for mysql and
   * sqlite - `'schema.tablename'`.
   *
   * @param schema The name of the schema
   * @param options
   */
  schema(schema: string, options?: SchemaOptions): this;

  /**
   * Get the tablename of the model, taking schema into account. The method will return The name as a string
   * if the model has no schema, or an object with `tableName`, `schema` and `delimiter` properties.
   *
   * @param options The hash of options from any query. You can use one model to access tables with matching
   *     schemas by overriding `getTableName` and using custom key/values to alter the name of the table.
   *     (eg.
   *     subscribers_1, subscribers_2)
   * @param options.logging=false A function that gets executed while running the query to log the sql.
   */
  getTableName(options?: { logging: Function }): string | { tableName: string, schema: string, delimiter: string };

  /**
   * Apply a scope created in `define` to the model. First let's look at how to create scopes:
   * ```js
   * var Model = sequelize.define('model', attributes, {
   *   defaultScope: {
   *     where: {
   *       username: 'dan'
   *     },
   *     limit: 12
   *   },
   *   scopes: {
   *     isALie: {
   *       where: {
   *         stuff: 'cake'
   *       }
   *     },
   *     complexFunction: function(email, accessLevel) {
   *       return {
   *         where: {
   *           email: {
   *             $like: email
   *           },
   *           accesss_level {
   *             $gte: accessLevel
   *           }
   *         }
   *       }
   *     }
   *   }
   * })
   * ```
   * Now, since you defined a default scope, every time you do Model.find, the default scope is appended to
   * your query. Here's a couple of examples:
   * ```js
   * Model.findAll() // WHERE username = 'dan'
   * Model.findAll({ where: { age: { gt: 12 } } }) // WHERE age > 12 AND username = 'dan'
   * ```
   *
   * To invoke scope functions you can do:
   * ```js
   * Model.scope({ method: ['complexFunction' 'dan@sequelize.com', 42]}).findAll()
   * // WHERE email like 'dan@sequelize.com%' AND access_level >= 42
   * ```
   *
   * @return Model A reference to the model, with the scope(s) applied. Calling scope again on the returned
   *     model will clear the previous scope.
   */
  scope(options?: string | string[] | ScopeOptions | WhereAttributeHash<TInstance>): this;

  /**
   * Search for multiple instances.
   *
   * __Simple search using AND and =__
   * ```js
   * Model.findAll({
   *   where: {
   *     attr1: 42,
   *     attr2: 'cake'
   *   }
   * })
   * ```
   * ```sql
   * WHERE attr1 = 42 AND attr2 = 'cake'
   * ```
   *
   * __Using greater than, less than etc.__
   * ```js
   *
   * Model.findAll({
   *   where: {
   *     attr1: {
   *       gt: 50
   *     },
   *     attr2: {
   *       lte: 45
   *     },
   *     attr3: {
   *       in: [1,2,3]
   *     },
   *     attr4: {
   *       ne: 5
   *     }
   *   }
   * })
   * ```
   * ```sql
   * WHERE attr1 > 50 AND attr2 <= 45 AND attr3 IN (1,2,3) AND attr4 != 5
   * ```
   * Possible options are: `$ne, $in, $not, $notIn, $gte, $gt, $lte, $lt, $like, $ilike/$iLike, $notLike,
   * $notILike, '..'/$between, '!..'/$notBetween, '&&'/$overlap, '@>'/$contains, '<@'/$contained`
   *
   * __Queries using OR__
   * ```js
   * Model.findAll({
   *   where: Sequelize.and(
   *     { name: 'a project' },
   *     Sequelize.or(
   *       { id: [1,2,3] },
   *       { id: { gt: 10 } }
   *     )
   *   )
   * })
   * ```
   * ```sql
   * WHERE name = 'a project' AND (id` IN (1,2,3) OR id > 10)
   * ```
   *
   * The success listener is called with an array of instances if the query succeeds.
   *
   * @see    {Sequelize#query}
   */
  findAll(options?: FindOptions<this, TInstance>): Promise<TInstance[]>;
  all(optionz?: FindOptions<this, TInstance>): Promise<TInstance[]>;

  /**
   * Search for a single instance by its primary key. This applies LIMIT 1, so the listener will
   * always be called with a single instance.
   */
  findById(identifier?: number | string, options?: FindOptions<this, TInstance>): Promise<TInstance>;
  findByPrimary(identifier?: number | string, options?: FindOptions<this, TInstance>): Promise<TInstance>;

  /**
   * Search for a single instance. This applies LIMIT 1, so the listener will always be called with a single
   * instance.
   */
  findOne(options?: FindOptions<this, TInstance>): Promise<TInstance>;
  find(optionz?: FindOptions<this, TInstance>): Promise<TInstance>;

  /**
   * Run an aggregation method on the specified field
   *
   * @param field The field to aggregate over. Can be a field name or *
   * @param aggregateFunction The function to use for aggregation, e.g. sum, max etc.
   * @param options Query options. See sequelize.query for full options
   * @return Returns the aggregate result cast to `options.dataType`, unless `options.plain` is false, in
   *     which case the complete data result is returned.
   */
  aggregate(field: string, aggregateFunction: string, options?: AggregateOptions<TInstance>): Promise<number>;

  /**
   * Count the number of records matching the provided where clause.
   *
   * If you provide an `include` option, the number of matching associations will be counted instead.
   */
  count(options?: CountOptions<this, TInstance>): Promise<number>;

  /**
   * Find all the rows matching your query, within a specified offset / limit, and get the total number of
   * rows matching your query. This is very usefull for paging
   *
   * ```js
   * Model.findAndCountAll({
   *   where: ...,
   *   limit: 12,
   *   offset: 12
   * }).then(function (result) {
   *   ...
   * })
   * ```
   * In the above example, `result.rows` will contain rows 13 through 24, while `result.count` will return
   * the
   * total number of rows that matched your query.
   *
   * When you add includes, only those which are required (either because they have a where clause, or
   * because
   * `required` is explicitly set to true on the include) will be added to the count part.
   *
   * Suppose you want to find all users who have a profile attached:
   * ```js
   * User.findAndCountAll({
   *   include: [
   *      { model: Profile, required: true}
   *   ],
   *   limit 3
   * });
   * ```
   * Because the include for `Profile` has `required` set it will result in an inner join, and only the users
   * who have a profile will be counted. If we remove `required` from the include, both users with and
   * without
   * profiles will be counted
   */
  findAndCount(options?: FindAndCountOptions<this, TInstance>): Promise<{ rows: TInstance[], count: number }>;
  findAndCountAll(options?: FindAndCountOptions<this, TInstance>): Promise<{ rows: TInstance[], count: number }>;

  /**
   * Find the maximum value of field
   */
  max(field: string, options?: AggregateOptions<TInstance>): Promise<any>;

  /**
   * Find the minimum value of field
   */
  min(field: string, options?: AggregateOptions<TInstance>): Promise<any>;

  /**
   * Find the sum of field
   */
  sum(field: string, options?: AggregateOptions<TInstance>): Promise<number>;

  /**
   * Builds a new model instance. Values is an object of key value pairs, must be defined but can be empty.
   */
  build(record?: Partial<TInstance>, options?: BuildOptions<this, TInstance>): TInstance;

  /**
   * Undocumented bulkBuild
   */
  bulkBuild(records: Partial<TInstance>[], options?: BuildOptions<this, TInstance>): TInstance;

  /**
   * Builds a new model instance and calls save on it.
   */
  create(values?: Partial<TInstance>, options?: CreateOptions<this, TInstance>): Promise<TInstance[]>;

  /**
   * Find a row that matches the query, or build (but don't save) the row if none is found.
   * The successfull result of the promise will be (instance, initialized) - Make sure to use .spread()
   */
  findOrInitialize(options: FindOrInitializeOptions<TInstance>): Promise<TInstance>;
  findOrBuild(options: FindOrInitializeOptions<TInstance>): Promise<TInstance>;

  /**
   * Find a row that matches the query, or build and save the row if none is found
   * The successful result of the promise will be (instance, created) - Make sure to use .spread()
   *
   * If no transaction is passed in the `options` object, a new transaction will be created internally, to
   * prevent the race condition where a matching row is created by another connection after the find but
   * before the insert call. However, it is not always possible to handle this case in SQLite, specifically
   * if one transaction inserts and another tries to select before the first one has comitted. In this case,
   * an instance of sequelize.TimeoutError will be thrown instead. If a transaction is created, a savepoint
   * will be created instead, and any unique constraint violation will be handled internally.
   */
  findOrCreate(options: FindOrInitializeOptions<TInstance>): Promise<TInstance>;

  /**
   * Insert or update a single row. An update will be executed if a row which matches the supplied values on
   * either the primary key or a unique key is found. Note that the unique index must be defined in your
   * sequelize model and not just in the table. Otherwise you may experience a unique constraint violation,
   * because sequelize fails to identify the row that should be updated.
   *
   * **Implementation details:**
   *
   * * MySQL - Implemented as a single query `INSERT values ON DUPLICATE KEY UPDATE values`
   * * PostgreSQL - Implemented as a temporary function with exception handling: INSERT EXCEPTION WHEN
   *   unique_constraint UPDATE
   * * SQLite - Implemented as two queries `INSERT; UPDATE`. This means that the update is executed
   * regardless
   *   of whether the row already existed or not
   *
   * **Note** that SQLite returns undefined for created, no matter if the row was created or updated. This is
   * because SQLite always runs INSERT OR IGNORE + UPDATE, in a single query, so there is no way to know
   * whether the row was inserted or not.
   */
  upsert(values: Partial<TInstance>, options?: UpsertOptions<TInstance>): Promise<boolean>;
  insertOrUpdate(values: Partial<TInstance>, options?: UpsertOptions<TInstance>): Promise<boolean>;

  /**
   * Create and insert multiple instances in bulk.
   *
   * The success handler is passed an array of instances, but please notice that these may not completely
   * represent the state of the rows in the DB. This is because MySQL and SQLite do not make it easy to
   * obtain
   * back automatically generated IDs and other default values in a way that can be mapped to multiple
   * records. To obtain Instances for the newly created values, you will need to query for them again.
   *
   * @param records List of objects (key/value pairs) to create instances from
   */
  bulkCreate(records: Partial<TInstance[]>, options?: BulkCreateOptions<TInstance>): Promise<TInstance[]>;

  /**
   * Truncate all instances of the model. This is a convenient method for Model.destroy({ truncate: true }).
   */
  truncate(options?: TruncateOptions): Promise<void>;

  /**
   * Delete multiple instances, or set their deletedAt timestamp to the current time if `paranoid` is enabled.
   *
   * @return Promise<number> The number of destroyed rows
   */
  destroy(options?: DestroyOptions<TInstance>): Promise<number>;

  /**
   * Restore multiple instances if `paranoid` is enabled.
   */
  restore(options?: RestoreOptions<TInstance>): Promise<void>;

  /**
   * Update multiple instances that match the where options. The promise returns an array with one or two
   * elements. The first element is always the number of affected rows, while the second element is the actual
   * affected rows (only supported in postgres with `options.returning` true.)
   */
  update(values: Partial<TInstance>, options: UpdateOptions<TInstance>): Promise<[number, TInstance[]]>;

  /**
   * Run a describe query on the table. The result will be return to the listener as a hash of attributes and
   * their types.
   */
  describe(): Promise<{ [K in keyof TInstance]: any }>;

  /**
   * Unscope the model
   */
  unscoped(): this;

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
  addHook(hookType: string, name: string, fn: Function): this;
  addHook(hookType: string, fn: Function): this;
  hook(hookType: string, name: string, fn: Function): this;
  hook(hookType: string, fn: Function): this;

  /**
   * Remove hook from the model
   *
   * @param hookType
   * @param name
   */
  removeHook(hookType: string, name: string): this;

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
  beforeValidate(name: string, fn: (instance: TInstance, options: Object) => void): void;
  beforeValidate(fn: (instance: TInstance, options: Object) => void): void;

  /**
   * A hook that is run after validation
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  afterValidate(name: string, fn: (instance: TInstance, options: Object) => void): void;
  afterValidate(fn: (instance: TInstance, options: Object) => void): void;

  /**
   * A hook that is run before creating a single instance
   *
   * @param name
   * @param fn A callback function that is called with attributes, options
   */
  beforeCreate(name: string, fn: (attributes: TInstance, options: CreateOptions<this, TInstance>) => void): void;
  beforeCreate(fn: (attributes: TInstance, options: CreateOptions<this, TInstance>) => void): void;

  /**
   * A hook that is run after creating a single instance
   *
   * @param name
   * @param fn A callback function that is called with attributes, options
   */
  afterCreate(name: string, fn: (attributes: TInstance, options: CreateOptions<this, TInstance>) => void): void;
  afterCreate(fn: (attributes: TInstance, options: CreateOptions<this, TInstance>) => void): void;

  /**
   * A hook that is run before destroying a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   * @alias beforeDelete
   */
  beforeDestroy(name: string, fn: (instance: TInstance, options: InstanceDestroyOptions) => void): void;
  beforeDestroy(fn: (instance: TInstance, options: InstanceDestroyOptions) => void): void;
  beforeDelete(name: string, fn: (instance: TInstance, options: InstanceDestroyOptions) => void): void;
  beforeDelete(fn: (instance: TInstance, options: InstanceDestroyOptions) => void): void;

  /**
   * A hook that is run after destroying a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   * @alias afterDelete
   */
  afterDestroy(name: string, fn: (instance: TInstance, options: InstanceDestroyOptions) => void): void;
  afterDestroy(fn: (instance: TInstance, options: InstanceDestroyOptions) => void): void;
  afterDelete(name: string, fn: (instance: TInstance, options: InstanceDestroyOptions) => void): void;
  afterDelete(fn: (instance: TInstance, options: InstanceDestroyOptions) => void): void;

  /**
   * A hook that is run before updating a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  beforeUpdate(name: string, fn: (instance: TInstance, options: UpdateOptions<TInstance>) => void): void;
  beforeUpdate(fn: (instance: TInstance, options: UpdateOptions<TInstance>) => void): void;

  /**
   * A hook that is run after updating a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  afterUpdate(name: string, fn: (instance: TInstance, options: UpdateOptions<TInstance>) => void): void;
  afterUpdate(fn: (instance: TInstance, options: UpdateOptions<TInstance>) => void): void;

  /**
   * A hook that is run before creating instances in bulk
   *
   * @param name
   * @param fn A callback function that is called with instances, options
   */
  beforeBulkCreate(name: string, fn: (instances: this[], options: BulkCreateOptions<TInstance>) => void): void;
  beforeBulkCreate(fn: (instances: this[], options: BulkCreateOptions<TInstance>) => void): void;

  /**
   * A hook that is run after creating instances in bulk
   *
   * @param name
   * @param fn A callback function that is called with instances, options
   * @name afterBulkCreate
   */
  afterBulkCreate(name: string, fn: (instances: this[], options: BulkCreateOptions<TInstance>) => void): void;
  afterBulkCreate(fn: (instances: this[], options: BulkCreateOptions<TInstance>) => void): void;

  /**
   * A hook that is run before destroying instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   *
   * @alias beforeBulkDelete
   */
  beforeBulkDestroy(name: string, fn: (options: DestroyOptions<TInstance>) => void): void;
  beforeBulkDestroy(fn: (options: DestroyOptions<TInstance>) => void): void;
  beforeBulkDelete(name: string, fn: (options: DestroyOptions<TInstance>) => void): void;
  beforeBulkDelete(fn: (options: DestroyOptions<TInstance>) => void): void;

  /**
   * A hook that is run after destroying instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   *
   * @alias afterBulkDelete
   */
  afterBulkDestroy(name: string, fn: (options: DestroyOptions<TInstance>) => void): void;
  afterBulkDestroy(fn: (options: DestroyOptions<TInstance>) => void): void;
  afterBulkDelete(name: string, fn: (options: DestroyOptions<TInstance>) => void): void;
  afterBulkDelete(fn: (options: DestroyOptions<TInstance>) => void): void;

  /**
   * A hook that is run after updating instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeBulkUpdate(name: string, fn: (options: UpdateOptions<TInstance>) => void): void;
  beforeBulkUpdate(fn: (options: UpdateOptions<TInstance>) => void): void;

  /**
   * A hook that is run after updating instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  afterBulkUpdate(name: string, fn: (options: UpdateOptions<TInstance>) => void): void;
  afterBulkUpdate(fn: (options: UpdateOptions<TInstance>) => void): void;

  /**
   * A hook that is run before a find (select) query
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeFind(name: string, fn: (options: FindOptions<this, TInstance>) => void): void;
  beforeFind(fn: (options: FindOptions<this, TInstance>) => void): void;

  /**
   * A hook that is run before a count query
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeCount(name: string, fn: (options: CountOptions<this, TInstance>) => void): void;
  beforeCount(fn: (options: CountOptions<this, TInstance>) => void): void;

  /**
   * A hook that is run before a find (select) query, after any { include: {all: ...} } options are expanded
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeFindAfterExpandIncludeAll(name: string, fn: (options: FindOptions<this, TInstance>) => void): void;
  beforeFindAfterExpandIncludeAll(fn: (options: FindOptions<this, TInstance>) => void): void;

  /**
   * A hook that is run before a find (select) query, after all option parsing is complete
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeFindAfterOptions(name: string, fn: (options: FindOptions<this, TInstance>) => void): void;
  beforeFindAfterOptions(fn: (options: FindOptions<this, TInstance>) => void): void;

  /**
   * A hook that is run after a find (select) query
   *
   * @param name
   * @param fn   A callback function that is called with instance(s), options
   */
  afterFind(name: string, fn: (instancesOrinstance: TInstance[] | TInstance, options: FindOptions<this, TInstance>, fn?: Function) => void): void;
  afterFind(fn: (instancesOrinstance: TInstance[] | TInstance, options: FindOptions<this, TInstance>,
    fn?: Function) => void): void;

  /**
   * A hook that is run before a define call
   *
   * @param name
   * @param fn   A callback function that is called with attributes, options
   */
  beforeDefine(name: string, fn: (attributes: DefineAttributes<TInstance>, options: DefineOptions<this, TInstance>) => void): void;
  beforeDefine(fn: (attributes: DefineAttributes<TInstance>, options: DefineOptions<this, TInstance>) => void): void;

  /**
   * A hook that is run after a define call
   *
   * @param name
   * @param fn   A callback function that is called with factory
   */
  afterDefine(name: string, fn: (model: this) => void): void;
  afterDefine(fn: (model: this) => void): void;

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

  /**
   * Creates an association between this (the source) and the provided target. The foreign key is added
   * on the target.
   *
   * Example: `User.hasOne(Profile)`. This will add userId to the profile table.
   *
   * @param target The model that will be associated with hasOne relationship
   * @param options Options for the association
   */
  hasOne<TTarget extends Model<Instance>>(target: TTarget, options?: HasOneOptions): HasOne<this, TTarget>;

  /**
   * Creates an association between this (the source) and the provided target. The foreign key is added on the
   * source.
   *
   * Example: `Profile.belongsTo(User)`. This will add userId to the profile table.
   *
   * @param target The model that will be associated with hasOne relationship
   * @param options Options for the association
   */
  belongsTo<TTarget extends Model<Instance>>(target: TTarget, options?: BelongsToOptions): BelongsTo<this, TTarget>;

  /**
   * Create an association that is either 1:m or n:m.
   *
   * ```js
   * // Create a 1:m association between user and project
   * User.hasMany(Project)
   * ```
   * ```js
   * // Create a n:m association between user and project
   * User.hasMany(Project)
   * Project.hasMany(User)
   * ```
   * By default, the name of the join table will be source+target, so in this case projectsusers. This can be
   * overridden by providing either a string or a Model as `through` in the options. If you use a through
   * model with custom attributes, these attributes can be set when adding / setting new associations in two
   * ways. Consider users and projects from before with a join table that stores whether the project has been
   * started yet:
   * ```js
   * var UserProjects = sequelize.define('userprojects', {
   *   started: Sequelize.BOOLEAN
   * })
   * User.hasMany(Project, { through: UserProjects })
   * Project.hasMany(User, { through: UserProjects })
   * ```
   * ```js
   * jan.addProject(homework, { started: false }) // The homework project is not started yet
   * jan.setProjects([makedinner, doshopping], { started: true}) // Both shopping and dinner have been
   * started
   * ```
   *
   * If you want to set several target instances, but with different attributes you have to set the
   * attributes on the instance, using a property with the name of the through model:
   *
   * ```js
   * p1.userprojects {
   *   started: true
   * }
   * user.setProjects([p1, p2], {started: false}) // The default value is false, but p1 overrides that.
   * ```
   *
   * Similarily, when fetching through a join table with custom attributes, these attributes will be
   * available as an object with the name of the through model.
   * ```js
   * user.getProjects().then(function (projects) {
   *   var p1 = projects[0]
   *   p1.userprojects.started // Is this project started yet?
   * })
   * ```
   *
   * @param target The model that will be associated with hasOne relationship
   * @param options Options for the association
   */
  hasMany<TTarget extends Model<Instance>>(target: TTarget, options?: HasManyOptions): HasMany<this, TTarget>;

  /**
   * Create an N:M association with a join table
   *
   * ```js
   * User.belongsToMany(Project)
   * Project.belongsToMany(User)
   * ```
   * By default, the name of the join table will be source+target, so in this case projectsusers. This can be
   * overridden by providing either a string or a Model as `through` in the options.
   *
   * If you use a through model with custom attributes, these attributes can be set when adding / setting new
   * associations in two ways. Consider users and projects from before with a join table that stores whether
   * the project has been started yet:
   * ```js
   * var UserProjects = sequelize.define('userprojects', {
   *   started: Sequelize.BOOLEAN
   * })
   * User.belongsToMany(Project, { through: UserProjects })
   * Project.belongsToMany(User, { through: UserProjects })
   * ```
   * ```js
   * jan.addProject(homework, { started: false }) // The homework project is not started yet
   * jan.setProjects([makedinner, doshopping], { started: true}) // Both shopping and dinner has been started
   * ```
   *
   * If you want to set several target instances, but with different attributes you have to set the
   * attributes on the instance, using a property with the name of the through model:
   *
   * ```js
   * p1.userprojects {
   *   started: true
   * }
   * user.setProjects([p1, p2], {started: false}) // The default value is false, but p1 overrides that.
   * ```
   *
   * Similarily, when fetching through a join table with custom attributes, these attributes will be
   * available as an object with the name of the through model.
   * ```js
   * user.getProjects().then(function (projects) {
   *   var p1 = projects[0]
   *   p1.userprojects.started // Is this project started yet?
   * })
   * ```
   *
   * @param target The model that will be associated with hasOne relationship
   * @param options Options for the association
   *
   */
  belongsToMany<TTarget extends Model<Instance>>(target: TTarget, options: BelongsToManyOptions): BelongsToMany<this, TTarget>;
}

export default Model;

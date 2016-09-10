
import {Promise} from './promise';
import {Col, Fn, Literal, Where} from './utils';
import {SyncOptions} from './sequelize';
import {QueryOptions} from './query-interface';
import {Transaction} from './transaction';
import {DataType} from './data-types';
import {Sequelize} from './sequelize';
import {AbstractDeferrable} from './deferrable';
import {ModelManager} from './model-manager';
import {
  Association,
  BelongsTo,
  BelongsToOptions,
  HasOne,
  HasOneOptions,
  HasMany,
  HasManyOptions,
  BelongsToMany,
  BelongsToManyOptions
} from './associations/index';

export type GroupOption = string | Fn | Col | (string | Fn | Col)[];

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
  logging?: Function | boolean

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
export type WhereOptions = WhereAttributeHash | AndOperator | OrOperator | Where | Array<string | number>;

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
export interface WhereOperators {

  /**
   * Example: `$any: [2,3]` becomes `ANY ARRAY[2, 3]::INTEGER`
   *
   * _PG only_
   */
  $any?: Array<string | number>;

  /** Example: `$gte: 6,` becomes `>= 6` */
  $gte?: number | string | Date;

  /** Example: `$lt: 10,` becomes `< 10` */
  $lt?: number | string | Date;

  /** Example: `$lte: 10,` becomes `<= 10` */
  $lte?: number | string | Date;

  /** Example: `$ne: 20,` becomes `!= 20` */
  $ne?: string | number | WhereOperators;

  /** Example: `$not: true,` becomes `IS NOT TRUE` */
  $not?: boolean | string | number | WhereOperators;

  /** Example: `$between: [6, 10],` becomes `BETWEEN 6 AND 10` */
  $between?: [number, number];

  /** Example: `$in: [1, 2],` becomes `IN [1, 2]` */
  $in?: Array<string | number> | Literal;

  /** Example: `$notIn: [1, 2],` becomes `NOT IN [1, 2]` */
  $notIn?: Array<string | number> | Literal;

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
  $gt?: number | string | Date;

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
export interface OrOperator {
  $or: WhereOperators | WhereAttributeHash | Array<WhereOperators | WhereAttributeHash>;
}

/** Example: `$and: {a: 5}` becomes `AND (a = 5)` */
export interface AndOperator {
  $and: WhereOperators | WhereAttributeHash | Array<WhereOperators | WhereAttributeHash>;
}

/**
 * Where Geometry Options
 */
export interface WhereGeometryOptions {
  type: string;
  coordinates: Array<Array<number> | number>;
}

/**
 * Used for the right hand side of WhereAttributeHash.
 * WhereAttributeHash is in there for JSON columns.
 */
export type WhereValue =
  string // literal value
  | number // literal value
  | WhereOperators
  | WhereAttributeHash // for JSON columns
  | Col // reference another column
  | OrOperator
  | AndOperator
  | WhereGeometryOptions
  | Array<string | number>; // implicit $or

/**
 * A hash of attributes to describe your search.
 */
export interface WhereAttributeHash {
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
  [field: string]: WhereValue;
}
/**
 * Through options for Include Options
 */
export interface IncludeThroughOptions {

  /**
   * Filter on the join model for belongsToMany relations
   */
  where?: WhereOptions;

  /**
   * A list of attributes to select from the join model for belongsToMany relations
   */
  attributes?: FindAttributeOptions;

}

export type Includeable = Model | Association | IncludeOptions;

/**
 * Complex include options
 */
export interface IncludeOptions {

  /**
   * The model you want to eagerly load
   */
  model?: typeof Model;

  /**
   * The alias of the relation, in case the model you want to eagerly load is aliassed. For `hasOne` /
   * `belongsTo`, this should be the singular name, and for `hasMany`, it should be the plural
   */
  as?: string;

  /**
   * The association you want to eagerly load. (This can be used instead of providing a model/as pair)
   */
  association?: Association;

  /**
   * Where clauses to apply to the child models. Note that this converts the eager load to an inner join,
   * unless you explicitly set `required: false`
   */
  where?: WhereOptions;

  /**
   * A list of attributes to select from the child model
   */
  attributes?: FindAttributeOptions;

  /**
   * If true, converts to an inner join, which means that the parent model will only be loaded if it has any
   * matching children. True if `include.where` is set, false otherwise.
   */
  required?: boolean;

  /**
   * Through Options
   */
  through?: IncludeThroughOptions;

  /**
   * Load further nested related models
   */
  include?: Includeable[];

}

export type OrderItem =
  string | Fn | Col | Literal |
  [string | Col | Fn | Literal, string] |
  [typeof Model | { model: typeof Model, as: string }, string, string] |
  [typeof Model, typeof Model, string, string];
export type Order = string | Fn | Col | Literal | OrderItem[];

export type FindAttributeOptions =
  Array<string | [string | Fn, string]> |
  {
    exclude: Array<string>;
  } | {
    exclude?: Array<string>;
    include: Array<string | [string | Fn, string]>;
  };

/**
 * Options that are passed to any model creating a SELECT query
 *
 * A hash of options to describe the scope of the search
 */
export interface FindOptions {
  /**
   * A hash of attributes to describe your search. See above for examples.
   */
  where?: WhereOptions;

  /**
   * A list of the attributes that you want to select. To rename an attribute, you can pass an array, with
   * two elements - the first is the name of the attribute in the DB (or some kind of expression such as
   * `Sequelize.literal`, `Sequelize.fn` and so on), and the second is the name you want the attribute to
   * have in the returned instance
   */
  attributes?: FindAttributeOptions;

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
  include?: Includeable[];

  /**
   * Specifies an ordering. If a string is provided, it will be escaped. Using an array, you can provide
   * several columns / functions to order by. Each element can be further wrapped in a two-element array. The
   * first element is the column / function to order by, the second is the direction. For example:
   * `order: [['name', 'DESC']]`. In this way the column will be escaped, but the direction will not.
   */
  order?: Order;

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
  lock?: string | { level: string, of: typeof Model };

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
  having?: WhereAttributeHash;

}

/**
 * Options for Model.count method
 */
export interface CountOptions {

  /**
   * A hash of search attributes.
   */
  where?: WhereOptions;

  /**
   * Include options. See `find` for details
   */
  include?: Array<typeof Model | IncludeOptions>;

  /**
   * Apply COUNT(DISTINCT(col))
   */
  distinct?: boolean;

  /**
   * Used in conjustion with `group`
   */
  attributes?: FindAttributeOptions;

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

/**
 * Options for Model.build method
 */
export interface BuildOptions {

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
  include?: Includeable[];

}

/**
 * Options for Model.create method
 */
export interface CreateOptions extends BuildOptions {

  /**
   * If set, only columns matching those in fields will be saved
   */
  fields?: Array<string>;

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
export interface FindOrInitializeOptions {

  /**
   * A hash of search attributes.
   */
  where: WhereOptions;

  /**
   * Default values to use if building a new instance
   */
  defaults?: Object;

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
export interface UpsertOptions {
  /**
   * Run validations before the row is inserted
   */
  validate?: boolean;

  /**
   * The fields to insert / update. Defaults to all fields
   */
  fields?: Array<string>;

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
export interface BulkCreateOptions {

  /**
   * Fields to insert (defaults to all fields)
   */
  fields?: Array<string>;

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
  logging?: boolean | ((sql: string) => any);

  /**
   * Filter the destroy
   */
  where?: WhereOptions;

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
export interface DestroyOptions extends TruncateOptions {

  /**
   * If set to true, dialects that support it will use TRUNCATE instead of DELETE FROM. If a table is
   * truncated the where and limit options are ignored
   */
  truncate?: boolean;

}

/**
 * Options for Model.restore
 */
export interface RestoreOptions {

  /**
   * Filter the restore
   */
  where?: WhereOptions;

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
export interface UpdateOptions {

  /**
   * Options to describe the scope of the search.
   */
  where: WhereOptions;

  /**
   * Fields to update (defaults to all fields)
   */
  fields?: Array<string>;

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
export interface AggregateOptions extends QueryOptions {
  /** A hash of search attributes. */
  where?: WhereOptions;

  /**
   * The type of the result. If `field` is a field in this Model, the default will be the type of that field,
   * otherwise defaults to float.
   */
  dataType?: DataType;

  /** Applies DISTINCT to the field being aggregated over */
  distinct?: boolean;
}

// instance


/**
 * Options used for Instance.increment method
 */
export interface IncrementDecrementOptions {

  /**
   * The number to increment by
   *
   * Defaults to 1
   */
  by?: number;

  /**
   * A function that gets executed while running the query to log the sql.
   */
  logging?: boolean | Function;

  /**
   * Transaction to run query under
   */
  transaction?: Transaction;

  /**
   * A hash of attributes to describe your search. See above for examples.
   */
  where?: WhereOptions;

}

/**
 * Options used for Instance.restore method
 */
export interface InstanceRestoreOptions {

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
 * Options used for Instance.destroy method
 */
export interface InstanceDestroyOptions {

  /**
   * If set to true, paranoid models will actually be deleted
   */
  force?: boolean;

  /**
   * A function that gets executed while running the query to log the sql.
   */
  logging?: boolean | Function;

  /**
   * Transaction to run the query in
   */
  transaction?: Transaction;

}

/**
 * Options used for Instance.update method
 */
export interface InstanceUpdateOptions extends SaveOptions, SetOptions {

  /**
   * A hash of attributes to describe your search. See above for examples.
   */
  where?: WhereOptions;

}

/**
 * Options used for Instance.set method
 */
export interface SetOptions {

  /**
   * If set to true, field and virtual setters will be ignored
   */
  raw?: boolean;

  /**
   * Clear all previously set data values
   */
  reset?: boolean;

}

/**
 * Options used for Instance.save method
 */
export interface SaveOptions {

  /**
   * An optional array of strings, representing database columns. If fields is provided, only those columns
   * will be validated and saved.
   */
  fields?: Array<string>;

  /**
   * If true, the updatedAt timestamp will not be updated.
   *
   * Defaults to false
   */
  silent?: boolean;

  /**
   * If false, validations won't be run.
   *
   * Defaults to true
   */
  validate?: boolean;

  /**
   * A function that gets executed while running the query to log the sql.
   */
  logging?: boolean | Function;

  /**
   * Transaction to run the query in
   */
  transaction?: Transaction;
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
export interface ModelValidateOptions {

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
export interface ModelIndexesOptions {

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
  fields?: Array<string | { attribute: string, length: number, order: string, collate: string }>

}

/**
 * Interface for name property in DefineOptions
 */
export interface ModelNameOptions {

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
 */
export interface ModelGetterOptions {
  [name: string]: () => any;
}

/**
 * Interface for setterMethods in DefineOptions
 */
export interface ModelSetterOptions {
  [name: string]: (val: any) => void;
}

/**
 * Interface for Define Scope Options
 */
export interface ModelScopeOptions {

  /**
   * Name of the scope and it's query
   */
  [scopeName: string]: FindOptions | Function;

}

/**
 * General column options
 */
export interface ColumnOptions {

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
  defaultValue?: any;

}

/**
 * References options for the column's attributes
 */
export interface ModelAttributeColumnReferencesOptions {

  /**
   * If this column references another table, provide it here as a Model, or a string
   */
  model?: string | typeof Model;

  /**
   * The column of the foreign table that this column references
   */
  key?: string;

  /**
   * When to check for the foreign key constraing
   *
   * PostgreSQL only
   */
  deferrable?: AbstractDeferrable;

}

/**
 * Column options for the model schema attributes
 */
export interface ModelAttributeColumnOptions extends ColumnOptions {

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
  references?: ModelAttributeColumnReferencesOptions;

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
  get?: () => any;

  /**
   * Provide a custom setter for this column. Use `this.setDataValue(String, Value)` to manipulate the
   * underlying values.
   */
  set?: (val: any) => void;

  /**
   * An object of validations to execute for this column every time the model is saved. Can be either the
   * name of a validation provided by validator.js, a validation function provided by extending validator.js
   * (see the
   * `DAOValidator` property for more details), or a custom validation function. Custom validation functions
   * are called with the value of the field, and can possibly take a second callback argument, to signal that
   * they are asynchronous. If the validator is sync, it should throw in the case of a failed validation, it
   * it is async, the callback should be called with the error text.
   */
  validate?: ModelValidateOptions;

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
  values?: Array<string>;

}

/**
 * Interface for Attributes provided for a column
 */
export interface ModelAttributes {

  /**
   * The description of a database column
   */
  [name: string]: DataType | ModelAttributeColumnOptions;
}


/**
 * Options for Model.init. We mostly duplicate the Hooks here, since there is no way to combine the two
 * interfaces.
 *
 * beforeValidate, afterValidate, beforeBulkCreate, beforeBulkDestroy, beforeBulkUpdate, beforeCreate,
 * beforeDestroy, beforeUpdate, afterCreate, afterDestroy, afterUpdate, afterBulkCreate, afterBulkDestroy and
 * afterBulkUpdate.
 */
export interface HooksOptions {

  beforeValidate?: (instance: Model, options: Object) => any;
  afterValidate?: (instance: Model, options: Object) => any;
  beforeCreate?: (attributes: Model, options: CreateOptions) => any;
  afterCreate?: (attributes: Model, options: CreateOptions) => any;
  beforeDestroy?: (instance: Model, options: InstanceDestroyOptions) => any;
  beforeDelete?: (instance: Model, options: InstanceDestroyOptions) => any;
  afterDestroy?: (instance: Model, options: InstanceDestroyOptions) => any;
  afterDelete?: (instance: Model, options: InstanceDestroyOptions) => any;
  beforeUpdate?: (instance: Model, options: InstanceUpdateOptions) => any;
  afterUpdate?: (instance: Model, options: InstanceUpdateOptions) => any;
  beforeBulkCreate?: (instances: Array<Model>, options: BulkCreateOptions) => any;
  afterBulkCreate?: (instances: Array<Model>, options: BulkCreateOptions) => any;
  beforeBulkDestroy?: (options: DestroyOptions) => any;
  beforeBulkDelete?: (options: DestroyOptions) => any;
  afterBulkDestroy?: (options: DestroyOptions) => any;
  afterBulkDelete?: (options: DestroyOptions) => any;
  beforeBulkUpdate?: (options: UpdateOptions) => any;
  afterBulkUpdate?: (options: UpdateOptions) => any;
  beforeFind?: (options: FindOptions) => any;
  beforeCount?: (options: CountOptions) => any;
  beforeFindAfterExpandIncludeAll?: (options: FindOptions) => any;
  beforeFindAfterOptions?: (options: FindOptions) => any;
  afterFind?: (instancesOrInstance: Array<Model> | Model, options: FindOptions) => any;
  beforeSync?: (options: SyncOptions) => any;
  afterSync?: (options: SyncOptions) => any;
  beforeBulkSync?: (options: SyncOptions) => any;
  afterBulkSync?: (options: SyncOptions) => any;
}

/**
 * Options for model definition
 */
export interface ModelOptions {

  /**
   * Define the default search scope to use for this model. Scopes have the same form as the options passed to
   * find / findAll.
   */
  defaultScope?: FindOptions;

  /**
   * More scopes, defined in the same way as defaultScope above. See `Model.scope` for more information about
   * how scopes are defined, and what you can do with them
   */
  scopes?: ModelScopeOptions;

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
  name?: ModelNameOptions;

  /**
   * Indexes for the provided database table
   */
  indexes?: Array<ModelIndexesOptions>;

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
  getterMethods?: ModelGetterOptions;

  /**
   * Provide setter functions that work like those defined per column. If you provide a setter method with
   * the
   * same name as a column, it will be used to update the value of that column. If you provide a name that
   * does not match a column, this function will act as a virtual setter, that can act on and set other
   * values, but will not be persisted
   */
  setterMethods?: ModelSetterOptions;

  /**
   * Provide functions that are added to each instance (DAO). If you override methods provided by sequelize,
   * you can access the original method using `this.constructor.super_.prototype`, e.g.
   * `this.constructor.super_.prototype.toJSON.apply(this, arguments)`
   */
  instanceMethods?: Object;

  /**
   * Provide functions that are added to the model (Model). If you override methods provided by sequelize,
   * you can access the original method using `this.constructor.prototype`, e.g.
   * `this.constructor.prototype.find.apply(this, arguments)`
   */
  classMethods?: Object;

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
  hooks?: HooksOptions;

  /**
   * An object of model wide validations. Validations have access to all model values via `this`. If the
   * validator function takes an argument, it is asumed to be async, and is called with a callback that
   * accepts an optional error.
   */
  validate?: ModelValidateOptions;

}

/**
 * Options passed to [[Model.init]]
 */
export interface InitOptions extends ModelOptions {
  /**
   * The sequelize connection. Required ATM.
   */
  sequelize: Sequelize;
}

export abstract class Model {

  /** The name of the database table */
  static tableName: string;

  /**
   * The name of the primary key attribute
   */
  static primaryKeyAttribute: string;

  /**
   * An object hash from alias to association object
   */
  static associations: any;

  /**
   * The options that the model was initialized with
   */
  static options: InitOptions;

  /**
   * Returns true if this instance has not yet been persisted to the database
   */
  isNewRecord: boolean;

  /**
   * A reference to the sequelize instance
   */
  sequelize: Sequelize;

  /**
   * Initialize a model, representing a table in the DB, with attributes and options.
   *
   * The table columns are define by the hash that is given as the second argument. Each attribute of the hash represents a column. A short table definition might look like this:
   *
   * ```js
   * Project.init({
   *   columnA: {
   *     type: Sequelize.BOOLEAN,
   *     validate: {
   *       is: ['[a-z]','i'],        // will only allow letters
   *       max: 23,                  // only allow values <= 23
   *       isIn: {
   *         args: [['en', 'zh']],
   *         msg: "Must be English or Chinese"
   *       }
   *     },
   *     field: 'column_a'
   *     // Other attributes here
   *   },
   *   columnB: Sequelize.STRING,
   *   columnC: 'MY VERY OWN COLUMN TYPE'
   * }, {sequelize})
   *
   * sequelize.models.modelName // The model will now be available in models under the class name
   * ```
   *
   * As shown above, column definitions can be either strings, a reference to one of the datatypes that are predefined on the Sequelize constructor, or an object that allows you to specify both the type of the column, and other attributes such as default values, foreign key constraints and custom setters and getters.
   *
   * For a list of possible data types, see http://docs.sequelizejs.com/en/latest/docs/models-definition/#data-types
   *
   * For more about getters and setters, see http://docs.sequelizejs.com/en/latest/docs/models-definition/#getters-setters
   *
   * For more about instance and class methods, see http://docs.sequelizejs.com/en/latest/docs/models-definition/#expansion-of-models
   *
   * For more about validation, see http://docs.sequelizejs.com/en/latest/docs/models-definition/#validations
   *
   * @param attributes
   *  An object, where each attribute is a column of the table. Each column can be either a DataType, a
   *  string or a type-description object, with the properties described below:
   * @param options These options are merged with the default define options provided to the Sequelize constructor
   */
  static init(attributes: ModelAttributes, options: InitOptions): void;

  /**
   * Remove attribute from model definition
   *
   * @param attribute
   */
  static removeAttribute(attribute: string): void;

  /**
   * Sync this Model to the DB, that is create the table. Upon success, the callback will be called with the
   * model instance (this)
   */
  static sync(options?: SyncOptions): Promise<Model>;

  /**
   * Drop the table represented by this Model
   *
   * @param options
   */
  static drop(options?: DropOptions): Promise<void>;

  /**
   * Apply a schema to this model. For postgres, this will actually place the schema in front of the table
   * name
   * - `"schema"."tableName"`, while the schema will be prepended to the table name for mysql and
   * sqlite - `'schema.tablename'`.
   *
   * @param schema The name of the schema
   * @param options
   */
  static schema(schema: string, options?: SchemaOptions): Model; // I would like to use `this` as return type here, but https://github.com/Microsoft/TypeScript/issues/5863

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
  static getTableName(options?: { logging: Function }): string | Object;

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
  static scope(options?: string | Array<string> | ScopeOptions | WhereAttributeHash): typeof Model;

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
  static findAll(options?: FindOptions): Promise<Array<Model>>;
  static all(optionz?: FindOptions): Promise<Array<Model>>;

  /**
   * Search for a single instance by its primary key. This applies LIMIT 1, so the listener will
   * always be called with a single instance.
   */
  static findById(identifier?: number | string, options?: FindOptions): Promise<Model>;
  static findByPrimary(identifier?: number | string, options?: FindOptions): Promise<Model>;

  /**
   * Search for a single instance. This applies LIMIT 1, so the listener will always be called with a single
   * instance.
   */
  static findOne(options?: FindOptions): Promise<Model>;
  static find(optionz?: FindOptions): Promise<Model>;

  /**
   * Run an aggregation method on the specified field
   *
   * @param field The field to aggregate over. Can be a field name or *
   * @param aggregateFunction The function to use for aggregation, e.g. sum, max etc.
   * @param options Query options. See sequelize.query for full options
   * @return Returns the aggregate result cast to `options.dataType`, unless `options.plain` is false, in
   *     which case the complete data result is returned.
   */
  aggregate<T>(field: string, aggregateFunction: string, options?: AggregateOptions): Promise<T>;
  static aggregate(field: string, aggregateFunction: string, options?: AggregateOptions): Promise<number>;

  /**
   * Count the number of records matching the provided where clause.
   *
   * If you provide an `include` option, the number of matching associations will be counted instead.
   */
  static count(options?: CountOptions): Promise<number>;

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
  static findAndCount(options?: FindOptions): Promise<{ rows: Array<Model>, count: number }>;
  static findAndCountAll(options?: FindOptions): Promise<{ rows: Array<Model>, count: number }>;

  /**
   * Find the maximum value of field
   */
  static max(field: string, options?: AggregateOptions): Promise<any>;

  /**
   * Find the minimum value of field
   */
  static min(field: string, options?: AggregateOptions): Promise<any>;

  /**
   * Find the sum of field
   */
  static sum(field: string, options?: AggregateOptions): Promise<number>;

  /**
   * Builds a new model instance. Values is an object of key value pairs, must be defined but can be empty.
   */
  static build(record?: Object, options?: BuildOptions): Model;

  /**
   * Undocumented bulkBuild
   */
  static bulkBuild(records: Object[], options?: BuildOptions): Array<Model>;

  /**
   * Builds a new model instance and calls save on it.
   */
  static create(values?: Object, options?: CreateOptions): Promise<Model>;

  /**
   * Find a row that matches the query, or build (but don't save) the row if none is found.
   * The successfull result of the promise will be (instance, initialized) - Make sure to use .spread()
   */
  static findOrInitialize(options: FindOrInitializeOptions): Promise<Model>;
  static findOrBuild(options: FindOrInitializeOptions): Promise<Model>;

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
  static findOrCreate(options: FindOrInitializeOptions): Promise<Model>;

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
  static upsert(values: Object, options?: UpsertOptions): Promise<boolean>;
  static insertOrUpdate(values: Object, options?: UpsertOptions): Promise<boolean>;

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
  static bulkCreate(records: Array<Object>, options?: BulkCreateOptions): Promise<Array<Model>>;

  /**
   * Truncate all instances of the model. This is a convenient method for Model.destroy({ truncate: true }).
   */
  static truncate(options?: TruncateOptions): Promise<void>;

  /**
   * Delete multiple instances, or set their deletedAt timestamp to the current time if `paranoid` is enabled.
   *
   * @return Promise<number> The number of destroyed rows
   */
  static destroy(options?: DestroyOptions): Promise<number>;

  /**
   * Restore multiple instances if `paranoid` is enabled.
   */
  static restore(options?: RestoreOptions): Promise<void>;

  /**
   * Update multiple instances that match the where options. The promise returns an array with one or two
   * elements. The first element is always the number of affected rows, while the second element is the actual
   * affected rows (only supported in postgres with `options.returning` true.)
   */
  static update(values: Object, options: UpdateOptions): Promise<[number, Array<Model>]>;

  /**
   * Run a describe query on the table. The result will be return to the listener as a hash of attributes and
   * their types.
   */
  static describe(): Promise<Object>;

  /**
   * Unscope the model
   */
  static unscoped(): typeof Model;

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
  static addHook(hookType: string, name: string, fn: Function): typeof Model;
  static addHook(hookType: string, fn: Function): typeof Model;
  static hook(hookType: string, name: string, fn: Function): typeof Model;
  static hook(hookType: string, fn: Function): typeof Model;

  /**
   * Remove hook from the model
   *
   * @param hookType
   * @param name
   */
  static removeHook(hookType: string, name: string): typeof Model;

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
  static beforeBulkCreate(name: string,
    fn: (instances: Model[], options: BulkCreateOptions) => void): void;
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
   * A hook that is run before a count query
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  static beforeCount(name: string, fn: (options: CountOptions) => void): void;
  static beforeCount(fn: (options: CountOptions) => void): void;

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

  /**
   * Creates an association between this (the source) and the provided target. The foreign key is added
   * on the target.
   *
   * Example: `User.hasOne(Profile)`. This will add userId to the profile table.
   *
   * @param target The model that will be associated with hasOne relationship
   * @param options Options for the association
   */
  static hasOne(target: typeof Model, options?: HasOneOptions): HasOne;

  /**
   * Creates an association between this (the source) and the provided target. The foreign key is added on the
   * source.
   *
   * Example: `Profile.belongsTo(User)`. This will add userId to the profile table.
   *
   * @param target The model that will be associated with hasOne relationship
   * @param options Options for the association
   */
  static belongsTo(target: typeof Model, options?: BelongsToOptions): BelongsTo;

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
  static hasMany(target: typeof Model, options?: HasManyOptions): HasMany;

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
  static belongsToMany(target: typeof Model, options: BelongsToManyOptions): BelongsToMany;

  /**
   * Builds a new model instance.
   * @param values an object of key value pairs
   */
  constructor(values?: Object, options?: BuildOptions);

  /**
   * Get an object representing the query for this instance, use with `options.where`
   */
  where(): Object;

  /**
   * Get the value of the underlying data value
   */
  getDataValue(key: string): any;

  /**
   * Update the underlying data value
   */
  setDataValue(key: string, value: any): void;

  /**
   * If no key is given, returns all values of the instance, also invoking virtual getters.
   *
   * If key is given and a field or virtual getter is present for the key it will call that getter - else it
   * will return the value for key.
   *
   * @param options.plain If set to true, included instances will be returned as plain objects
   */
  get(options?: { plain?: boolean, clone?: boolean }): any;
  get(key: string, options?: { plain?: boolean, clone?: boolean }): any;

  /**
   * Set is used to update values on the instance (the sequelize representation of the instance that is,
   * remember that nothing will be persisted before you actually call `save`). In its most basic form `set`
   * will update a value stored in the underlying `dataValues` object. However, if a custom setter function
   * is defined for the key, that function will be called instead. To bypass the setter, you can pass `raw:
   * true` in the options object.
   *
   * If set is called with an object, it will loop over the object, and call set recursively for each key,
   * value pair. If you set raw to true, the underlying dataValues will either be set directly to the object
   * passed, or used to extend dataValues, if dataValues already contain values.
   *
   * When set is called, the previous value of the field is stored and sets a changed flag(see `changed`).
   *
   * Set can also be used to build instances for associations, if you have values for those.
   * When using set with associations you need to make sure the property key matches the alias of the
   * association while also making sure that the proper include options have been set (from .build() or
   * .find())
   *
   * If called with a dot.seperated key on a JSON/JSONB attribute it will set the value nested and flag the
   * entire object as changed.
   *
   * @param options.raw If set to true, field and virtual setters will be ignored
   * @param options.reset Clear all previously set data values
   */
  set(key: string, value: any, options?: SetOptions): Model;
  set(keys: Object, options?: SetOptions): Model;
  setAttributes(key: string, value: any, options?: SetOptions): Model;
  setAttributes(keys: Object, options?: SetOptions): Model;

  /**
   * If changed is called with a string it will return a boolean indicating whether the value of that key in
   * `dataValues` is different from the value in `_previousDataValues`.
   *
   * If changed is called without an argument, it will return an array of keys that have changed.
   *
   * If changed is called without an argument and no keys have changed, it will return `false`.
   */
  changed(key: string): boolean;
  changed(): boolean | Array<string>;

  /**
   * Returns the previous value for key from `_previousDataValues`.
   */
  previous(key: string): any;

  /**
   * Validate this instance, and if the validation passes, persist it to the database.
   *
   * On success, the callback will be called with this instance. On validation error, the callback will be
   * called with an instance of `Sequelize.ValidationError`. This error will have a property for each of the
   * fields for which validation failed, with the error message for that field.
   */
  save(options?: SaveOptions): Promise<Model>;

  /**
   * Refresh the current instance in-place, i.e. update the object with current data from the DB and return
   * the same object. This is different from doing a `find(Instance.id)`, because that would create and
   * return a new instance. With this method, all references to the Instance are updated with the new data
   * and no new objects are created.
   */
  reload(options?: FindOptions): Promise<Model>;

  /**
   * Validate the attribute of this instance according to validation rules set in the model definition.
   *
   * Emits null if and only if validation successful; otherwise an Error instance containing
   * { field name : [error msgs] } entries.
   *
   * @param options.skip An array of strings. All properties that are in this array will not be validated
   */
  validate(options?: { skip?: Array<string> }): Promise<void>;

  /**
   * This is the same as calling `set` and then calling `save`.
   */
  update(key: string, value: any, options?: InstanceUpdateOptions): Promise<Model>;
  update(keys: Object, options?: InstanceUpdateOptions): Promise<Model>;
  updateAttributes(key: string, value: any, options?: InstanceUpdateOptions): Promise<Model>;
  updateAttributes(keys: Object, options?: InstanceUpdateOptions): Promise<Model>;

  /**
   * Destroy the row corresponding to this instance. Depending on your setting for paranoid, the row will
   * either be completely deleted, or have its deletedAt timestamp set to the current time.
   */
  destroy(options?: InstanceDestroyOptions): Promise<void>;

  /**
   * Restore the row corresponding to this instance. Only available for paranoid models.
   */
  restore(options?: InstanceRestoreOptions): Promise<void>;

  /**
   * Increment the value of one or more columns. This is done in the database, which means it does not use
   * the values currently stored on the Instance. The increment is done using a
   * ```sql
   * SET column = column + X
   * ```
   * query. To get the correct value after an increment into the Instance you should do a reload.
   *
   * ```js
   * instance.increment('number') // increment number by 1
   * instance.increment(['number', 'count'], { by: 2 }) // increment number and count by 2
   * instance.increment({ answer: 42, tries: 1}, { by: 2 }) // increment answer by 42, and tries by 1.
   *                                                        // `by` is ignored, since each column has its own
   *                                                        // value
   * ```
   *
   * @param fields If a string is provided, that column is incremented by the value of `by` given in options.
   *               If an array is provided, the same is true for each column.
   *               If and object is provided, each column is incremented by the value given.
   */
  increment(fields: string | Array<string> | Object,
    options?: IncrementDecrementOptions): Promise<Model>;

  /**
   * Decrement the value of one or more columns. This is done in the database, which means it does not use
   * the values currently stored on the Instance. The decrement is done using a
   * ```sql
   * SET column = column - X
   * ```
   * query. To get the correct value after an decrement into the Instance you should do a reload.
   *
   * ```js
   * instance.decrement('number') // decrement number by 1
   * instance.decrement(['number', 'count'], { by: 2 }) // decrement number and count by 2
   * instance.decrement({ answer: 42, tries: 1}, { by: 2 }) // decrement answer by 42, and tries by 1.
   *                                                        // `by` is ignored, since each column has its own
   *                                                        // value
   * ```
   *
   * @param fields If a string is provided, that column is decremented by the value of `by` given in options.
   *               If an array is provided, the same is true for each column.
   *               If and object is provided, each column is decremented by the value given
   */
  decrement(fields: string | Array<string> | Object,
    options?: IncrementDecrementOptions): Promise<Model>;

  /**
   * Check whether all values of this and `other` Instance are the same
   */
  equals(other: Model): boolean;

  /**
   * Check if this is eqaul to one of `others` by calling equals
   */
  equalsOneOf(others: Model[]): boolean;

  /**
   * Convert the instance to a JSON representation. Proxies to calling `get` with no keys. This means get all
   * values gotten from the DB, and apply all custom getters.
   */
  toJSON(): Object;
}

export default Model;

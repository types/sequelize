
import {Sequelize, QueryOptions, Connection, DefineAttributeColumnOptions, DefineAttributes} from './sequelize';
import {Transaction} from './transaction';
import {Instance} from './instance';
import {DataType} from './data-types';
import {Promise as SequelizePromise} from './promise';
import {Model} from './model';

/**
 * Most of the methods accept options and use only the logger property of the options. That's why the most used
 * interface type for options in a method is separated here as another interface.
 */
export interface QueryInterfaceOptions {
  /** A function that receives the sql query, e.g. console.log */
  logging?: Function;
}

export interface QueryInterfaceCreateTableOptions extends QueryInterfaceOptions {
  engine?: string;
  charset?: string;
}

export interface QueryInterfaceDropTableOptions extends QueryInterfaceOptions {
  cascade?: boolean;
  force?: boolean;
}

export interface QueryInterfaceDropAllTablesOptions extends QueryInterfaceOptions {
  skip?: string[];
}

export interface QueryInterfaceIndexOptions extends QueryInterfaceOptions {
  indicesType?: 'UNIQUE'|'FULLTEXT'|'SPATIAL';

  /** The name of the index. Default is __ */
  indexName?: string;

  /** For FULLTEXT columns set your parser */
  parser?: string;

  /** Set a type for the index, e.g. BTREE. See the documentation of the used dialect */
  indexType?: string;
}

/**
 * The interface that Sequelize uses to talk to all databases.
 *
 * This interface is available through sequelize. It should not be commonly used, but it's
 * referenced anyway, so it can be used.
 */
export class QueryInterface {

  /**
   * Returns the dialect-specific sql generator.
   *
   * We don't have a definition for the QueryGenerator, because I doubt it is commonly in use separately.
   */
  QueryGenerator: any;

  /**
   * Returns the current sequelize instance.
   */
  sequelize: Connection;

  /**
   * Queries the schema (table list).
   *
   * @param schema The schema to query. Applies only to Postgres.
   */
  createSchema(schema?: string, options?: QueryInterfaceOptions): SequelizePromise<void>;

  /**
   * Drops the specified schema (table).
   *
   * @param schema The schema to query. Applies only to Postgres.
   */
  dropSchema(schema?: string, options?: QueryInterfaceOptions): SequelizePromise<void>;

  /**
   * Drops all tables.
   */
  dropAllSchemas(options?: QueryInterfaceDropAllTablesOptions): SequelizePromise<void>;

  /**
   * Queries all table names in the database.
   *
   * @param options
   */
  showAllSchemas(options?: QueryOptions): SequelizePromise<Object>;

  /**
   * Return database version
   */
  databaseVersion(options?: QueryInterfaceOptions): SequelizePromise<string>;

  /**
   * Creates a table with specified attributes.
   *
   * @param tableName     Name of table to create
   * @param attributes    Hash of attributes, key is attribute name, value is data type
   * @param options       Table options.
   */
  createTable(tableName: string | { schema?: string, tableName?: string }, attributes: DefineAttributes<any>,
    options?: QueryInterfaceCreateTableOptions): SequelizePromise<void>;

  /**
   * Drops the specified table.
   *
   * @param tableName Table name.
   * @param options   Query options, particularly "force".
   */
  dropTable(tableName: string, options?: QueryInterfaceDropTableOptions): SequelizePromise<void>;

  /**
   * Drops all tables.
   *
   * @param options
   */
  dropAllTables(options?: QueryInterfaceDropTableOptions): SequelizePromise<void>;

  /**
   * Drops all defined enums
   *
   * @param options
   */
  dropAllEnums(options?: QueryOptions): SequelizePromise<void>;

  /**
   * Renames a table
   */
  renameTable(before: string, after: string, options?: QueryInterfaceOptions): SequelizePromise<void>;

  /**
   * Returns all tables
   */
  showAllTables(options?: QueryOptions): SequelizePromise<Array<string>>;

  /**
   * Describe a table
   */
  describeTable(tableName: string | { schema?: string, tableName?: string },
    options?: string | { schema?: string, schemaDelimeter?: string, logging?: boolean | Function }): SequelizePromise<Object>;

  /**
   * Adds a new column to a table
   */
  addcolumn(table: string, key: string, attribute: DefineAttributeColumnOptions<any, any> | DataType,
    options?: QueryInterfaceOptions): SequelizePromise<void>;

  /**
   * Removes a column from a table
   */
  removecolumn(table: string, attribute: string, options?: QueryInterfaceOptions): SequelizePromise<void>;

  /**
   * Changes a column
   */
  changecolumn(tableName: string | { schema?: string, tableName?: string }, attributeName: string,
    dataTypeOrOptions?: DataType | DefineAttributeColumnOptions<any, any>,
    options?: QueryInterfaceOptions): SequelizePromise<void>;

  /**
   * Renames a column
   */
  renamecolumn(tableName: string | { schema?: string, tableName?: string }, attrNameBefore: string,
    attrNameAfter: string,
    options?: QueryInterfaceOptions): SequelizePromise<void>;

  /**
   * Adds a new index to a table
   */
  addIndex(tableName: string, attributes: string[], options?: QueryInterfaceIndexOptions,
    rawTablename?: string): SequelizePromise<void>;
  addIndex(tableName: string, options: QueryInterfaceIndexOptions & { fields: string[] },
    rawTablename?: string): SequelizePromise<void>;

  /**
   * Removes an index of a table
   */
  removeIndex(tableName: string, indexName: string,
    options?: QueryInterfaceIndexOptions): SequelizePromise<void>;
  removeIndex(tableName: string, attributes: string[],
    options?: QueryInterfaceIndexOptions): SequelizePromise<void>;

  /**
   * Shows the index of a table
   */
  showIndex(tableName: string | Object, options?: QueryOptions): SequelizePromise<Object>;

  /**
   * Put a name to an index
   */
  nameIndexes(indexes: Array<string>, rawTablename: string): SequelizePromise<void>;

  /**
   * Returns all foreign key constraints of a table
   */
  getForeignKeysForTables(tableNames: string, options?: QueryInterfaceOptions): SequelizePromise<Object>;

  /**
   * Inserts a new record
   */
  insert(instance: Instance, tableName: string, values: Object,
    options?: QueryOptions): SequelizePromise<Object>;

  /**
   * Inserts or Updates a record in the database
   */
  upsert(tableName: string, values: Object, updateValues: Object, model: Model<any>,
    options?: QueryOptions): SequelizePromise<Object>;

  /**
   * Inserts multiple records at once
   */
  bulkInsert(tableName: string, records: Array<Object>, options?: QueryOptions,
    attributes?: Array<string> | string): SequelizePromise<Object>;

  /**
   * Updates a row
   */
  update(instance: Instance, tableName: string, values: Object, identifier: Object,
    options?: QueryOptions): SequelizePromise<Object>;

  /**
   * Updates multiple rows at once
   */
  bulkUpdate(tableName: string, values: Object, identifier: Object, options?: QueryOptions,
    attributes?: Array<string> | string): SequelizePromise<Object>;

  /**
   * Deletes a row
   */
  delete(instance: Instance, tableName: string, identifier: Object,
    options?: QueryOptions): SequelizePromise<Object>;

  /**
   * Deletes multiple rows at once
   */
  bulkDelete(tableName: string, identifier: Object, options?: QueryOptions,
    model?: Model<any>): SequelizePromise<Object>;

  /**
   * Returns selected rows
   */
  select(model: Model<any>, tableName: string, options?: QueryOptions): SequelizePromise<Array<Object>>;

  /**
   * Increments a row value
   */
  increment(instance: Instance, tableName: string, values: Object, identifier: Object,
    options?: QueryOptions): SequelizePromise<Object>;

  /**
   * Selects raw without parsing the string into an object
   */
  rawSelect(tableName: string, options: QueryOptions, attributeSelector: string | Array<string>,
    model?: Model<any>): SequelizePromise<Array<string>>;

  /**
   * Postgres only. Creates a trigger on specified table to call the specified function with supplied
   * parameters.
   */
  createTrigger(tableName: string, triggerName: string, timingType: string, fireOnArray: Array<any>,
    functionName: string, functionParams: Array<any>, optionsArray: Array<string>,
    options?: QueryInterfaceOptions): SequelizePromise<void>;

  /**
   * Postgres only. Drops the specified trigger.
   */
  dropTrigger(tableName: string, triggerName: string, options?: QueryInterfaceOptions): SequelizePromise<void>;

  /**
   * Postgres only. Renames a trigger
   */
  renameTrigger(tableName: string, oldTriggerName: string, newTriggerName: string,
    options?: QueryInterfaceOptions): SequelizePromise<void>;

  /**
   * Postgres only. Create a function
   */
  createFunction(functionName: string, params: Array<any>, returnType: string, language: string,
    body: string, options?: QueryOptions): SequelizePromise<void>;

  /**
   * Postgres only. Drops a function
   */
  dropFunction(functionName: string, params: Array<any>,
    options?: QueryInterfaceOptions): SequelizePromise<void>;

  /**
   * Postgres only. Rename a function
   */
  renameFunction(oldFunctionName: string, params: Array<any>, newFunctionName: string,
    options?: QueryInterfaceOptions): SequelizePromise<void>;

  /**
   * Escape an identifier (e.g. a table or attribute name). If force is true, the identifier will be quoted
   * even if the `quoteIdentifiers` option is false.
   */
  quoteIdentifier(identifier: string, force: boolean): string;

  /**
   * Escape a table name
   */
  quoteTable(identifier: string): string;

  /**
   * Split an identifier into .-separated tokens and quote each part. If force is true, the identifier will be
   * quoted even if the `quoteIdentifiers` option is false.
   */
  quoteIdentifiers(identifiers: string, force: boolean): string;

  /**
   * Escape a value (e.g. a string, number or date)
   */
  escape(value?: string | number | Date): string;

  /**
   * Set option for autocommit of a transaction
   */
  setAutocommit(transaction: Transaction, value: boolean, options?: QueryOptions): SequelizePromise<void>;

  /**
   * Set the isolation level of a transaction
   */
  setIsolationLevel(transaction: Transaction, value: string, options?: QueryOptions): SequelizePromise<void>;

  /**
   * Begin a new transaction
   */
  startTransaction(transaction: Transaction, options?: QueryOptions): SequelizePromise<void>;

  /**
   * Defer constraints
   */
  deferConstraints(transaction: Transaction, options?: QueryOptions): SequelizePromise<void>;

  /**
   * Commit an already started transaction
   */
  commitTransaction(transaction: Transaction, options?: QueryOptions): SequelizePromise<void>;

  /**
   * Rollback ( revert ) a transaction that has'nt been commited
   */
  rollbackTransaction(transaction: Transaction, options?: QueryOptions): SequelizePromise<void>;

}

export default QueryInterface;

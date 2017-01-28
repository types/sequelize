
import SequelizePromise from './promise';


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

/**
 * The transaction object is used to identify a running transaction. It is created by calling
 * `Sequelize.transaction()`.
 *
 * To run a query under a transaction, you should pass the transaction in the options object.
 */
export class Transaction {

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

export default Transaction;

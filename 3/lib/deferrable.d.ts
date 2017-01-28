
//
//  Deferrable
// ~~~~~~~~~~~~
//
//  https://github.com/sequelize/sequelize/blob/v3.4.1/lib/deferrable.js
//

/**
 * Abstract Deferrable interface. Use this if you want to create an interface that has a value any of the
 * Deferrables that Sequelize supports.
 */
export interface DeferrableAbstract {

  /**
   * Although this is not needed for the definitions itself, we want to make sure that DeferrableAbstract is
   * not something than can be evaluated to an empty object.
   */
  toString(): string;
  toSql(): string;

}

export interface DeferrableInitiallyDeferred extends DeferrableAbstract {

  /**
   * A property that will defer constraints checks to the end of transactions.
   */
  (): DeferrableInitiallyDeferred;

}

export interface DeferrableInitiallyImmediate extends DeferrableAbstract {

  /**
   * A property that will trigger the constraint checks immediately
   */
  (): DeferrableInitiallyImmediate;

}

export interface DeferrableNot extends DeferrableAbstract {

  /**
   * A property that will set the constraints to not deferred. This is the default in PostgreSQL and it make
   * it impossible to dynamically defer the constraints within a transaction.
   */
  (): DeferrableNot;

}

export interface DeferrableSetDeferred extends DeferrableAbstract {

  /**
   * A property that will trigger an additional query at the beginning of a
   * transaction which sets the constraints to deferred.
   *
   * @param constraints An array of constraint names. Will defer all constraints by default.
   */
  (constraints: Array<string>): DeferrableSetDeferred;

}

export interface DeferrableSetImmediate extends DeferrableAbstract {

  /**
   * A property that will trigger an additional query at the beginning of a
   * transaction which sets the constraints to immediately.
   *
   * @param constraints An array of constraint names. Will defer all constraints by default.
   */
  (constraints: Array<string>): DeferrableSetImmediate;

}

/**
 * A collection of properties related to deferrable constraints. It can be used to
 * make foreign key constraints deferrable and to set the constaints within a
 * transaction. This is only supported in PostgreSQL.
 *
 * The foreign keys can be configured like this. It will create a foreign key
 * that will check the constraints immediately when the data was inserted.
 *
 * ```js
 * sequelize.define('Model', {
 *   foreign_id: {
 *     type: Sequelize.INTEGER,
 *     references: {
 *       model: OtherModel,
 *       key: 'id',
 *       deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
 *     }
 *   }
 * });
 * ```
 *
 * The constraints can be configured in a transaction like this. It will
 * trigger a query once the transaction has been started and set the constraints
 * to be checked at the very end of the transaction.
 *
 * ```js
 * sequelize.transaction({
 *   deferrable: Sequelize.Deferrable.SET_DEFERRED
 * });
 * ```
 */
export interface Deferrable {
  INITIALLY_DEFERRED: DeferrableInitiallyDeferred;
  INITIALLY_IMMEDIATE: DeferrableInitiallyImmediate;
  NOT: DeferrableNot;
  SET_DEFERRED: DeferrableSetDeferred;
  SET_IMMEDIATE: DeferrableSetImmediate;
}

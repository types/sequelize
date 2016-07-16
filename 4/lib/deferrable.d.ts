
export interface AbstractDeferrableStatic {
  new (): AbstractDeferrable;
  (): AbstractDeferrable;
}
export interface AbstractDeferrable {
  toString(): string;
  toSql(): string;
}

export interface InitiallyDeferredDeferrableStatic extends AbstractDeferrableStatic {
  new (): InitiallyDeferredDeferrable;
  (): InitiallyDeferredDeferrable;
}
export interface InitiallyDeferredDeferrable extends AbstractDeferrable {}
export const INITIALLY_DEFERRED: InitiallyDeferredDeferrableStatic;

export interface InitiallyImmediateDeferrableStatic extends AbstractDeferrableStatic {
  new (): InitiallyImmediateDeferrable;
  (): InitiallyImmediateDeferrable;
}
export interface InitiallyImmediateDeferrable extends AbstractDeferrable {}
export const INITIALLY_IMMEDIATE: InitiallyImmediateDeferrableStatic;


/**
 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
 * it impossible to dynamically defer the constraints within a transaction.
 */
export interface NotDeferrableStatic extends AbstractDeferrableStatic {
  new (): NotDeferrable;
  (): NotDeferrable;
}
export interface NotDeferrable {}
export const NOT: NotDeferrableStatic;


/**
 * Will trigger an additional query at the beginning of a
 * transaction which sets the constraints to deferred.
 *
 * @param constraints An array of constraint names. Will defer all constraints by default.
 */
export interface SetDeferredDeferrableStatic extends AbstractDeferrableStatic {
  new (constraints: string[]): SetDeferredDeferrable;
  (constraints: string[]): SetDeferredDeferrable;
}
export interface SetDeferredDeferrable {}
export const SET_DEFERRED: SetDeferredDeferrableStatic;


/**
 * Will trigger an additional query at the beginning of a
 * transaction which sets the constraints to immediately.
 *
 * @param constraints An array of constraint names. Will defer all constraints by default.
 */
export interface SetImmediateDeferrableStatic extends AbstractDeferrableStatic {
  new (constraints: string[]): SetImmediateDeferrable;
  (constraints: string[]): SetImmediateDeferrable;
}
export interface SetImmediateDeferrable {}
export const SET_IMMEDIATE: SetImmediateDeferrableStatic;

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
export const Deferrable: {
  INITIALLY_DEFERRED: InitiallyDeferredDeferrableStatic;
  INITIALLY_IMMEDIATE: InitiallyImmediateDeferrableStatic;
  NOT: NotDeferrableStatic;
  SET_DEFERRED: SetDeferredDeferrableStatic;
  SET_IMMEDIATE: SetImmediateDeferrableStatic;
}

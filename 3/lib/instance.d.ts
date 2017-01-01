
/**
 * Options used for Instance.increment method
 */
export interface IncrementDecrementOptions<TInstance extends Instance> {

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
  where?: WhereOptions<TInstance>;

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
export interface InstanceUpdateOptions<TInstance extends Instance> extends InstanceSaveOptions<TInstance>, InstanceSetOptions {

  /**
   * A hash of attributes to describe your search. See above for examples.
   */
  where?: WhereOptions<TInstance>;

}

/**
 * Options used for Instance.set method
 */
export interface InstanceSetOptions {

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
export interface InstanceSaveOptions<TInstance extends Instance> {

  /**
   * An optional array of strings, representing database columns. If fields is provided, only those columns
   * will be validated and saved.
   */
  fields?: Array<keyof TInstance>;

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
 * This class represents an single instance, a database row. You might see it referred to as both Instance and
 * instance. You should not instantiate the Instance class directly, instead you access it using the finder and
 * creation methods on the model.
 *
 * Instance instances operate with the concept of a `dataValues` property, which stores the actual values
 * represented by the instance. By default, the values from dataValues can also be accessed directly from the
 * Instance, that is:
 * ```js
 * instance.field
 * // is the same as
 * instance.get('field')
 * // is the same as
 * instance.getDataValue('field')
 * ```
 * However, if getters and/or setters are defined for `field` they will be invoked, instead of returning the
 * value from `dataValues`. Accessing properties directly or using `get` is preferred for regular use,
 * `getDataValue` should only be used for custom getters.
 *
 * @see Sequelize.define for more information about getters and setters
 */
export class Instance {

  Model: ModelStatic<this>;

  /**
   * Returns true if this instance has not yet been persisted to the database
   */
  isNewRecord: boolean;

  /**
   * A reference to the sequelize instance
   */
  sequelize: Connection;

  /**
   * Get an object representing the query for this instance, use with `options.where`
   */
  where(): WhereOptions<this>;

  /**
   * Get the value of the underlying data value
   */
  getDataValue<K extends keyof this>(key: K): this[K];

  /**
   * Update the underlying data value
   */
  setDataValue<K extends keyof this>(key: K, value: this[K]): void;

  /**
   * If no key is given, returns all values of the instance, also invoking virtual getters.
   *
   * If key is given and a field or virtual getter is present for the key it will call that getter - else it
   * will return the value for key.
   *
   * @param options.plain If set to true, included instances will be returned as plain objects
   */
  get(options?: { plain?: boolean, clone?: boolean }): { [K in keyof this]: this[K] };
  get<K extends keyof this>(key: K, options?: { plain?: boolean, clone?: boolean }): this[K];

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
  set<K extends keyof this>(key: K, value: this[K], options?: SetOptions): this;
  set(keys: Partial<this>, options?: SetOptions): this;
  setAttributes<K extends keyof this>(key: K, value: this[K], options?: SetOptions): this;
  setAttributes(keys: Partial<this>, options?: SetOptions): this;

  /**
   * If changed is called with a string it will return a boolean indicating whether the value of that key in
   * `dataValues` is different from the value in `_previousDataValues`.
   *
   * If changed is called without an argument, it will return an array of keys that have changed.
   *
   * If changed is called with two arguments, it will set the property to `dirty`.
   *
   * If changed is called without an argument and no keys have changed, it will return `false`.
   */
  changed(key: keyof this): boolean;
  changed(key: keyof this, dirty: boolean): void;
  changed(): boolean | Array<keyof this>;

  /**
   * Returns the previous value for key from `_previousDataValues`.
   */
  previous<K extends keyof this>(key: K): this[K];

  /**
   * Validate this instance, and if the validation passes, persist it to the database.
   *
   * On success, the callback will be called with this instance. On validation error, the callback will be
   * called with an instance of `Sequelize.ValidationError`. This error will have a property for each of the
   * fields for which validation failed, with the error message for that field.
   */
  save(options?: InstanceSaveOptions<this>): Promise<this>;

  /**
   * Refresh the current instance in-place, i.e. update the object with current data from the DB and return
   * the same object. This is different from doing a `find(Instance.id)`, because that would create and
   * return a new instance. With this method, all references to the Instance are updated with the new data
   * and no new objects are created.
   */
  reload(options?: FindOptions<Model<this>, this>): Promise<this>;

  /**
   * Validate the attribute of this instance according to validation rules set in the model definition.
   *
   * Emits null if and only if validation successful; otherwise an Error instance containing
   * { field name : [error msgs] } entries.
   *
   * @param options.skip An array of strings. All properties that are in this array will not be validated
   */
  validate(options?: { skip?: string[] }): Promise<void>;

  /**
   * This is the same as calling `set` and then calling `save`.
   */
  update<K extends keyof this>(key: K, value: this[K], options?: InstanceUpdateOptions<this>): Promise<this>;
  update(keys: Partial<this>, options?: InstanceUpdateOptions<this>): Promise<this>;
  updateAttributes<K extends keyof this>(key: K, value: this[K], options?: InstanceUpdateOptions<this>): Promise<this>;
  updateAttributes(keys: Partial<this>, options?: InstanceUpdateOptions<this>): Promise<this>;

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
  increment(fields: keyof this | (keyof this)[] | { [K in keyof this]?: number }, options?: IncrementDecrementOptions<this>): Promise<this>;

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
  decrement(fields: keyof this | (keyof this)[] | { [K in keyof this]?: number }, options?: IncrementDecrementOptions<this>): Promise<this>;

  /**
   * Check whether all values of this and `other` Instance are the same
   */
  equals(other: this): boolean;

  /**
   * Check if this is eqaul to one of `others` by calling equals
   */
  equalsOneOf(others: this[]): boolean;

  /**
   * Convert the instance to a JSON representation. Proxies to calling `get` with no keys. This means get all
   * values gotten from the DB, and apply all custom getters.
   */
  toJSON(): { [K in keyof this]: this[K] };
}

export default Instance;

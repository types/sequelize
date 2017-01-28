
import {Model, CreateOptions, BulkCreateOptions, DestroyOptions, UpdateOptions, FindOptions, CountOptions} from './model';
import {Instance, InstanceDestroyOptions, InstanceUpdateOptions} from './instance';
import {SyncOptions, DefineAttributes, DefineOptions, Connection} from './sequelize';

/**
 * Options for Sequelize.define. We mostly duplicate the Hooks here, since there is no way to combine the two
 * interfaces.
 *
 * beforeValidate, afterValidate, beforeBulkCreate, beforeBulkDestroy, beforeBulkUpdate, beforeCreate,
 * beforeDestroy, beforeUpdate, afterCreate, afterDestroy, afterUpdate, afterBulkCreate, afterBulkDestroy and
 * afterBulkUpdate.
 */
export interface HooksOptions<TModel extends Model<TInstance>, TInstance extends Instance> {

  beforeValidate?: (instance: TInstance, options: Object) => any;
  afterValidate?: (instance: TInstance, options: Object) => any;
  beforeCreate?: (attributes: TInstance, options: CreateOptions<TModel, TInstance>) => any;
  afterCreate?: (attributes: TInstance, options: CreateOptions<TModel, TInstance>) => any;
  beforeDestroy?: (instance: TInstance, options: InstanceDestroyOptions) => any;
  beforeDelete?: (instance: TInstance, options: InstanceDestroyOptions) => any;
  afterDestroy?: (instance: TInstance, options: InstanceDestroyOptions) => any;
  afterDelete?: (instance: TInstance, options: InstanceDestroyOptions) => any;
  beforeUpdate?: (instance: TInstance, options: InstanceUpdateOptions<TInstance>) => any;
  afterUpdate?: (instance: TInstance, options: InstanceUpdateOptions<TInstance>) => any;
  beforeBulkCreate?: (instances: Array<TInstance>, options: BulkCreateOptions<TInstance>) => any;
  afterBulkCreate?: (instances: Array<TInstance>, options: BulkCreateOptions<TInstance>) => any;
  beforeBulkDestroy?: (options: DestroyOptions<TInstance>) => any;
  beforeBulkDelete?: (options: DestroyOptions<TInstance>) => any;
  afterBulkDestroy?: (options: DestroyOptions<TInstance>) => any;
  afterBulkDelete?: (options: DestroyOptions<TInstance>) => any;
  beforeBulkUpdate?: (options: UpdateOptions<TInstance>) => any;
  afterBulkUpdate?: (options: UpdateOptions<TInstance>) => any;
  beforeFind?: (options: FindOptions<TModel, TInstance>) => any;
  beforeCount?: (options: CountOptions<TModel, TInstance>) => any;
  beforeFindAfterExpandIncludeAll?: (options: FindOptions<TModel, TInstance>) => any;
  beforeFindAfterOptions?: (options: FindOptions<TModel, TInstance>) => any;
  afterFind?: (instancesOrInstance: Array<TInstance> | TInstance, options: FindOptions<TModel, TInstance>) => any;
  beforeSync?: (options: SyncOptions) => any;
  afterSync?: (options: SyncOptions) => any;
  beforeBulkSync?: (options: SyncOptions) => any;
  afterBulkSync?: (options: SyncOptions) => any;
}

/**
 * Hooks are function that are called before and after  (bulk-) creation/updating/deletion and validation.
 * Hooks can be added to you models in three ways:
 *
 * 1. By specifying them as options in `sequelize.define`
 * 2. By calling `hook()` with a string and your hook handler function
 * 3. By calling the function with the same name as the hook you want
 *
 * ```js
 * // Method 1
 * sequelize.define(name, { attributes }, {
 *   hooks: {
 *     beforeBulkCreate: function () {
 *       // can be a single function
 *     },
 *     beforeValidate: [
 *       function () {},
 *       function() {} // Or an array of several
 *     ]
 *   }
 * })
 *
 * // Method 2
 * Model.hook('afterDestroy', function () {})
 *
 * // Method 3
 * Model.afterBulkUpdate(function () {})
 * ```
 *
 * @see Sequelize.define
 */
export interface Hooks<TModel extends Model<TInstance>, TInstance extends Instance> {

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
  addHook(hookType: string, name: string, fn: Function): Hooks<TModel, TInstance>;
  addHook(hookType: string, fn: Function): Hooks<TModel, TInstance>;
  hook(hookType: string, name: string, fn: Function): Hooks<TModel, TInstance>;
  hook(hookType: string, fn: Function): Hooks<TModel, TInstance>;

  /**
   * Remove hook from the model
   *
   * @param hookType
   * @param name
   */
  removeHook(hookType: string, name: string): Hooks<TModel, TInstance>;

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
  beforeValidate(name: string,
    fn: (instance: TInstance, options: Object, fn?: Function) => void): void;
  beforeValidate(fn: (instance: TInstance, options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run after validation
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  afterValidate(name: string,
    fn: (instance: TInstance, options: Object, fn?: Function) => void): void;
  afterValidate(fn: (instance: TInstance, options: Object, fn?: Function) => void): void;

  /**
   * A hook that is run before creating a single instance
   *
   * @param name
   * @param fn A callback function that is called with attributes, options
   */
  beforeCreate(name: string,
    fn: (attributes: TInstance, options: CreateOptions<TModel, TInstance>, fn?: Function) => void): void;
  beforeCreate(fn: (attributes: TInstance, options: CreateOptions<TModel, TInstance>, fn?: Function) => void): void;

  /**
   * A hook that is run after creating a single instance
   *
   * @param name
   * @param fn A callback function that is called with attributes, options
   */
  afterCreate(name: string,
    fn: (attributes: TInstance, options: CreateOptions<TModel, TInstance>, fn?: Function) => void): void;
  afterCreate(fn: (attributes: TInstance, options: CreateOptions<TModel, TInstance>, fn?: Function) => void): void;

  /**
   * A hook that is run before destroying a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   * @alias beforeDelete
   */
  beforeDestroy(name: string,
    fn: (instance: TInstance, options: InstanceDestroyOptions, fn?: Function) => void): void;
  beforeDestroy(fn: (instance: TInstance, options: InstanceDestroyOptions, fn?: Function) => void): void;
  beforeDelete(name: string,
    fn: (instance: TInstance, options: InstanceDestroyOptions, fn?: Function) => void): void;
  beforeDelete(fn: (instance: TInstance, options: InstanceDestroyOptions, fn?: Function) => void): void;

  /**
   * A hook that is run after destroying a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   * @alias afterDelete
   */
  afterDestroy(name: string,
    fn: (instance: TInstance, options: InstanceDestroyOptions, fn?: Function) => void): void;
  afterDestroy(fn: (instance: TInstance, options: InstanceDestroyOptions, fn?: Function) => void): void;
  afterDelete(name: string, fn: (instance: TInstance, options: InstanceDestroyOptions, fn?: Function) => void): void;
  afterDelete(fn: (instance: TInstance, options: InstanceDestroyOptions, fn?: Function) => void): void;

  /**
   * A hook that is run before updating a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  beforeUpdate(name: string,
    fn: (instance: TInstance, options: UpdateOptions<TInstance>, fn?: Function) => void): void;
  beforeUpdate(fn: (instance: TInstance, options: UpdateOptions<TInstance>, fn?: Function) => void): void;

  /**
   * A hook that is run after updating a single instance
   *
   * @param name
   * @param fn A callback function that is called with instance, options
   */
  afterUpdate(name: string, fn: (instance: TInstance, options: UpdateOptions<TInstance>, fn?: Function) => void): void;
  afterUpdate(fn: (instance: TInstance, options: UpdateOptions<TInstance>, fn?: Function) => void): void;

  /**
   * A hook that is run before creating instances in bulk
   *
   * @param name
   * @param fn A callback function that is called with instances, options
   */
  beforeBulkCreate(name: string,
    fn: (instances: Array<TInstance>, options: BulkCreateOptions<TInstance>, fn?: Function) => void): void;
  beforeBulkCreate(fn: (instances: Array<TInstance>, options: BulkCreateOptions<TInstance>, fn?: Function) => void): void;

  /**
   * A hook that is run after creating instances in bulk
   *
   * @param name
   * @param fn A callback function that is called with instances, options
   * @name afterBulkCreate
   */
  afterBulkCreate(name: string,
    fn: (instances: Array<TInstance>, options: BulkCreateOptions<TInstance>, fn?: Function) => void): void;
  afterBulkCreate(fn: (instances: Array<TInstance>, options: BulkCreateOptions<TInstance>, fn?: Function) => void): void;

  /**
   * A hook that is run before destroying instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   *
   * @alias beforeBulkDelete
   */
  beforeBulkDestroy(name: string, fn: (options: BulkCreateOptions<TInstance>, fn?: Function) => void): void;
  beforeBulkDestroy(fn: (options: BulkCreateOptions<TInstance>, fn?: Function) => void): void;
  beforeBulkDelete(name: string, fn: (options: BulkCreateOptions<TInstance>, fn?: Function) => void): void;
  beforeBulkDelete(fn: (options: BulkCreateOptions<TInstance>, fn?: Function) => void): void;

  /**
   * A hook that is run after destroying instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   *
   * @alias afterBulkDelete
   */
  afterBulkDestroy(name: string, fn: (options: DestroyOptions<TInstance>, fn?: Function) => void): void;
  afterBulkDestroy(fn: (options: DestroyOptions<TInstance>, fn?: Function) => void): void;
  afterBulkDelete(name: string, fn: (options: DestroyOptions<TInstance>, fn?: Function) => void): void;
  afterBulkDelete(fn: (options: DestroyOptions<TInstance>, fn?: Function) => void): void;

  /**
   * A hook that is run after updating instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeBulkUpdate(name: string, fn: (options: UpdateOptions<TInstance>, fn?: Function) => void): void;
  beforeBulkUpdate(fn: (options: UpdateOptions<TInstance>, fn?: Function) => void): void;

  /**
   * A hook that is run after updating instances in bulk
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  afterBulkUpdate(name: string, fn: (options: UpdateOptions<TInstance>, fn?: Function) => void): void;
  afterBulkUpdate(fn: (options: UpdateOptions<TInstance>, fn?: Function) => void): void;

  /**
   * A hook that is run before a find (select) query
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeFind(name: string, fn: (options: FindOptions<TModel, TInstance>, fn?: Function) => void): void;
  beforeFind(fn: (options: FindOptions<TModel, TInstance>, fn?: Function) => void): void;

  /**
   * A hook that is run before a count query
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeCount(name: string, fn: (options: CountOptions<TModel, TInstance>, fn?: Function) => void): void;
  beforeCount(fn: (options: CountOptions<TModel, TInstance>, fn?: Function) => void): void;

  /**
   * A hook that is run before a find (select) query, after any { include: {all: ...} } options are expanded
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeFindAfterExpandIncludeAll(name: string,
    fn: (options: FindOptions<TModel, TInstance>, fn?: Function) => void): void;
  beforeFindAfterExpandIncludeAll(fn: (options: FindOptions<TModel, TInstance>, fn?: Function) => void): void;

  /**
   * A hook that is run before a find (select) query, after all option parsing is complete
   *
   * @param name
   * @param fn   A callback function that is called with options
   */
  beforeFindAfterOptions(name: string, fn: (options: FindOptions<TModel, TInstance>, fn?: Function) => void): void;
  beforeFindAfterOptions(fn: (options: FindOptions<TModel, TInstance>, fn?: Function) => void): void;

  /**
   * A hook that is run after a find (select) query
   *
   * @param name
   * @param fn   A callback function that is called with instance(s), options
   */
  afterFind(name: string,
    fn: (instancesOrInstance: Array<TInstance> | TInstance, options: FindOptions<TModel, TInstance>,
      fn?: Function) => void): void;
  afterFind(fn: (instancesOrInstance: Array<TInstance> | TInstance, options: FindOptions<TModel, TInstance>,
    fn?: Function) => void): void;

  /**
   * A hook that is run before a define call
   *
   * @param name
   * @param fn   A callback function that is called with attributes, options
   */
  beforeDefine(name: string, fn: (attributes: DefineAttributes<TInstance>, options: DefineOptions<TModel, TInstance>) => void): void;
  beforeDefine(fn: (attributes: DefineAttributes<TInstance>, options: DefineOptions<TModel, TInstance>) => void): void;

  /**
   * A hook that is run after a define call
   *
   * @param name
   * @param fn   A callback function that is called with factory
   */
  afterDefine(name: string, fn: (model: Model<TInstance>) => void): void;
  afterDefine(fn: (model: Model<TInstance>) => void): void;

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

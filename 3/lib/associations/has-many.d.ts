
import {Association, ManyToManyOptions, MultiAssociationAccessors} from './base';
import {Model, Instance, WhereOptions, FindOptions, InstanceUpdateOptions, InstanceDestroyOptions, CreateOptions} from '../../index';
import {DataType} from '../data-types';
import {Transaction} from '../../index';
import Promise = require('../promise');

/**
 * Options provided when associating models with hasMany relationship
 */
export interface HasManyOptions extends ManyToManyOptions {

  /**
   * A string or a data type to represent the identifier in the table
   */
  keyType?: DataType;
}

export class HasMany<TSource extends Model<Instance>, TTarget extends Model<Instance>> extends Association<TSource, TTarget> {
  accessors: MultiAssociationAccessors;
  constructor(source: TSource, target: TTarget, options: HasManyOptions);
}


  /**
   * The options for the getAssociations mixin of the hasMany association.
   * @see HasManyGetAssociationsMixin
   */
  export interface HasManyGetAssociationsMixinOptions<TInstance extends Instance> {

    /**
     * An optional where clause to limit the associated models.
     */
    where?: WhereOptions<TInstance>;

    /**
     * Apply a scope on the related model, or remove its default scope by passing false.
     */
    scope?: string | boolean;

    /**
     * Transaction to run query under
     */
    transaction?: Transaction;
  }

  /**
   * The getAssociations mixin applied to models with hasMany.
   * An example of usage is as follows:
   *
   * ```js
   *
   * User.hasMany(Role);
   *
   * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
   *    getRoles: Sequelize.HasManyGetAssociationsMixin<RoleInstance>;
   *    // setRoles...
   *    // addRoles...
   *    // addRole...
   *    // createRole...
   *    // removeRole...
   *    // removeRoles...
   *    // hasRole...
   *    // hasRoles...
   *    // countRoles...
   * }
   * ```
   *
   * @see http://docs.sequelizejs.com/en/latest/api/associations/has-many/
   * @see Instance
   */
  export interface HasManyGetAssociationsMixin<TInstance extends Instance> {
    /**
     * Get everything currently associated with this, using an optional where clause.
     * @param options The options to use when getting the associations.
     */
    (options?: HasManyGetAssociationsMixinOptions<TInstance>): Promise<TInstance[]>
  }

  /**
   * The options for the setAssociations mixin of the hasMany association.
   * @see HasManySetAssociationsMixin
   */
  export interface HasManySetAssociationsMixinOptions<TModel extends Model<TInstance>, TInstance extends Instance> extends
    FindOptions<TModel, TInstance>,
    InstanceUpdateOptions<TInstance> { }

  /**
   * The setAssociations mixin applied to models with hasMany.
   * An example of usage is as follows:
   *
   * ```js
   *
   * User.hasMany(Role);
   *
   * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
   *    // getRoles...
   *    setRoles: Sequelize.HasManySetAssociationsMixin<RoleInstance, RoleId>;
   *    // addRoles...
   *    // addRole...
   *    // createRole...
   *    // removeRole...
   *    // removeRoles...
   *    // hasRole...
   *    // hasRoles...
   *    // countRoles...
   * }
   * ```
   *
   * @see http://docs.sequelizejs.com/en/latest/api/associations/has-many/
   * @see Instance
   */
  export interface HasManySetAssociationsMixin<TModel extends Model<TInstance>, TInstance extends Instance, TPrimaryKey> {
    /**
     * Set the associated models by passing an array of instances or their primary keys.
     * Everything that it not in the passed array will be un-associated.
     * @param newAssociations An array of instances or primary key of instances to associate with this. Pass null or undefined to remove all associations.
     * @param options The options passed to `target.findAll` and `update`.
     */
    (
      newAssociations?: Array<TInstance | TPrimaryKey>,
      options?: HasManySetAssociationsMixinOptions<TModel, TInstance>
    ): Promise<void>
  }

  /**
   * The options for the addAssociations mixin of the hasMany association.
   * @see HasManyAddAssociationsMixin
   */
  export interface HasManyAddAssociationsMixinOptions<TInstance extends Instance> extends InstanceUpdateOptions<TInstance> { }

  /**
   * The addAssociations mixin applied to models with hasMany.
   * An example of usage is as follows:
   *
   * ```js
   *
   * User.hasMany(Role);
   *
   * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
   *    // getRoles...
   *    // setRoles...
   *    addRoles: Sequelize.HasManyAddAssociationsMixin<RoleInstance, RoleId>;
   *    // addRole...
   *    // createRole...
   *    // removeRole...
   *    // removeRoles...
   *    // hasRole...
   *    // hasRoles...
   *    // countRoles...
   * }
   * ```
   *
   * @see http://docs.sequelizejs.com/en/latest/api/associations/has-many/
   * @see Instance
   */
  export interface HasManyAddAssociationsMixin<TInstance extends Instance, TPrimaryKey> {
    /**
     * Associate several instances with this.
     * @param newAssociations An array of instances or primary key of instances to associate with this.
     * @param options The options passed to `target.update`.
     */
    (
      newAssociations?: Array<TInstance | TPrimaryKey>,
      options?: HasManyAddAssociationsMixinOptions<TInstance>
    ): Promise<void>
  }

  /**
   * The options for the addAssociation mixin of the hasMany association.
   * @see HasManyAddAssociationMixin
   */
  export interface HasManyAddAssociationMixinOptions<TInstance extends Instance> extends InstanceUpdateOptions<TInstance> { }

  /**
   * The addAssociation mixin applied to models with hasMany.
   * An example of usage is as follows:
   *
   * ```js
   *
   * User.hasMany(Role);
   *
   * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
   *    // getRoles...
   *    // setRoles...
   *    // addRoles...
   *    addRole: Sequelize.HasManyAddAssociationMixin<RoleInstance, RoleId>;
   *    // createRole...
   *    // removeRole...
   *    // removeRoles...
   *    // hasRole...
   *    // hasRoles...
   *    // countRoles...
   * }
   * ```
   *
   * @see http://docs.sequelizejs.com/en/latest/api/associations/has-many/
   * @see Instance
   */
  export interface HasManyAddAssociationMixin<TInstance extends Instance, TPrimaryKey> {
    /**
     * Associate an instance with this.
     * @param newAssociation An instance or the primary key of an instance to associate with this.
     * @param options The options passed to `target.update`.
     */
    (
      newAssociation?: TInstance | TPrimaryKey,
      options?: HasManyAddAssociationMixinOptions<TInstance>
    ): Promise<void>
  }

  /**
   * The options for the createAssociation mixin of the hasMany association.
   * @see HasManyCreateAssociationMixin
   */
  export interface HasManyCreateAssociationMixinOptions<TModel extends Model<TInstance>, TInstance extends Instance> extends CreateOptions<TModel, TInstance> { }

  /**
   * The createAssociation mixin applied to models with hasMany.
   * An example of usage is as follows:
   *
   * ```js
   *
   * User.hasMany(Role);
   *
   * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
   *    // getRoles...
   *    // setRoles...
   *    // addRoles...
   *    // addRole...
   *    createRole: Sequelize.HasManyCreateAssociationMixin<RoleAttributes>;
   *    // removeRole...
   *    // removeRoles...
   *    // hasRole...
   *    // hasRoles...
   *    // countRoles...
   * }
   * ```
   *
   * @see http://docs.sequelizejs.com/en/latest/api/associations/has-many/
   * @see Instance
   */
  export interface HasManyCreateAssociationMixin<TModel extends Model<TInstance>, TInstance extends Instance> {
    /**
     * Create a new instance of the associated model and associate it with this.
     * @param values The values used to create the association.
     * @param options The options to use when creating the association.
     */
    (
      values?: Partial<TInstance>,
      options?: HasManyCreateAssociationMixinOptions<TModel, TInstance>
    ): Promise<TInstance>
  }

  /**
   * The options for the removeAssociation mixin of the hasMany association.
   * @see HasManyRemoveAssociationMixin
   */
  export interface HasManyRemoveAssociationMixinOptions extends InstanceDestroyOptions { }

  /**
   * The removeAssociation mixin applied to models with hasMany.
   * An example of usage is as follows:
   *
   * ```js
   *
   * User.hasMany(Role);
   *
   * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
   *    // getRoles...
   *    // setRoles...
   *    // addRoles...
   *    // addRole...
   *    // createRole...
   *    removeRole: Sequelize.HasManyRemoveAssociationMixin<RoleInstance, RoleId>;
   *    // removeRoles...
   *    // hasRole...
   *    // hasRoles...
   *    // countRoles...
   * }
   * ```
   *
   * @see http://docs.sequelizejs.com/en/latest/api/associations/has-many/
   * @see Instance
   */
  export interface HasManyRemoveAssociationMixin<TInstance extends Instance, TPrimaryKey> {
    /**
     * Un-associate the instance.
     * @param oldAssociated The instance or the primary key of the instance to un-associate.
     * @param options The options passed to `target.update`.
     */
    (
      oldAssociated?: TInstance | TPrimaryKey,
      options?: HasManyRemoveAssociationMixinOptions
    ): Promise<void>
  }

  /**
   * The options for the removeAssociations mixin of the hasMany association.
   * @see HasManyRemoveAssociationsMixin
   */
  export interface HasManyRemoveAssociationsMixinOptions<TInstance extends Instance> extends InstanceUpdateOptions<TInstance> { }

  /**
   * The removeAssociations mixin applied to models with hasMany.
   * An example of usage is as follows:
   *
   * ```js
   *
   * User.hasMany(Role);
   *
   * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
   *    // getRoles...
   *    // setRoles...
   *    // addRoles...
   *    // addRole...
   *    // createRole...
   *    // removeRole...
   *    removeRoles: Sequelize.HasManyRemoveAssociationsMixin<RoleInstance, RoleId>;
   *    // hasRole...
   *    // hasRoles...
   *    // countRoles...
   * }
   * ```
   *
   * @see http://docs.sequelizejs.com/en/latest/api/associations/has-many/
   * @see Instance
   */
  export interface HasManyRemoveAssociationsMixin<TInstance extends Instance, TPrimaryKey> {
    /**
     * Un-associate several instances.
     * @param oldAssociated An array of instances or primary key of instances to un-associate.
     * @param options The options passed to `target.update`.
     */
    (
      oldAssociateds?: Array<TInstance | TPrimaryKey>,
      options?: HasManyRemoveAssociationsMixinOptions<TInstance>
    ): Promise<void>
  }

  /**
   * The options for the hasAssociation mixin of the hasMany association.
   * @see HasManyHasAssociationMixin
   */
  export interface HasManyHasAssociationMixinOptions<TInstance extends Instance> extends HasManyGetAssociationsMixinOptions<TInstance> { }

  /**
   * The hasAssociation mixin applied to models with hasMany.
   * An example of usage is as follows:
   *
   * ```js
   *
   * User.hasMany(Role);
   *
   * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
   *    // getRoles...
   *    // setRoles...
   *    // addRoles...
   *    // addRole...
   *    // createRole...
   *    // removeRole...
   *    // removeRoles...
   *    hasRole: Sequelize.HasManyHasAssociationMixin<RoleInstance, RoleId>;
   *    // hasRoles...
   *    // countRoles...
   * }
   * ```
   *
   * @see http://docs.sequelizejs.com/en/latest/api/associations/has-many/
   * @see Instance
   */
  export interface HasManyHasAssociationMixin<TInstance extends Instance, TPrimaryKey> {
    /**
     * Check if an instance is associated with this.
     * @param target The instance or the primary key of the instance to check.
     * @param options The options passed to `getAssociations`.
     */
    (
      target: TInstance | TPrimaryKey,
      options?: HasManyHasAssociationMixinOptions<TInstance>
    ): Promise<boolean>
  }

  /**
   * The options for the hasAssociations mixin of the hasMany association.
   * @see HasManyHasAssociationsMixin
   */
  export interface HasManyHasAssociationsMixinOptions<TInstance extends Instance> extends HasManyGetAssociationsMixinOptions<TInstance> { }

  /**
   * The removeAssociations mixin applied to models with hasMany.
   * An example of usage is as follows:
   *
   * ```js
   *
   * User.hasMany(Role);
   *
   * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
   *    // getRoles...
   *    // setRoles...
   *    // addRoles...
   *    // addRole...
   *    // createRole...
   *    // removeRole...
   *    // removeRoles
   *    // hasRole...
   *    hasRoles: Sequelize.HasManyHasAssociationsMixin<RoleInstance, RoleId>;
   *    // countRoles...
   * }
   * ```
   *
   * @see http://docs.sequelizejs.com/en/latest/api/associations/has-many/
   * @see Instance
   */
  export interface HasManyHasAssociationsMixin<TInstance extends Instance, TPrimaryKey> {
    /**
     * Check if all instances are associated with this.
     * @param targets An array of instances or primary key of instances to check.
     * @param options The options passed to `getAssociations`.
     */
    (
      targets: Array<TInstance | TPrimaryKey>,
      options?: HasManyHasAssociationsMixinOptions<TInstance>
    ): Promise<boolean>
  }

  /**
   * The options for the countAssociations mixin of the hasMany association.
   * @see HasManyCountAssociationsMixin
   */
  export interface HasManyCountAssociationsMixinOptions<TInstance extends Instance> {

    /**
     * An optional where clause to limit the associated models.
     */
    where?: WhereOptions<TInstance>;

    /**
     * Apply a scope on the related model, or remove its default scope by passing false.
     */
    scope?: string | boolean;

    /**
     * Transaction to run query under
     */
    transaction?: Transaction;
  }

  /**
   * The countAssociations mixin applied to models with hasMany.
   * An example of usage is as follows:
   *
   * ```js
   *
   * User.hasMany(Role);
   *
   * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
   *    // getRoles...
   *    // setRoles...
   *    // addRoles...
   *    // addRole...
   *    // createRole...
   *    // removeRole...
   *    // removeRoles...
   *    // hasRole...
   *    // hasRoles...
   *    countRoles: Sequelize.HasManyCountAssociationsMixin;
   * }
   * ```
   *
   * @see http://docs.sequelizejs.com/en/latest/api/associations/has-many/
   * @see Instance
   */
  export interface HasManyCountAssociationsMixin<TInstance extends Instance> {
    /**
     * Count everything currently associated with this, using an optional where clause.
     * @param options The options to use when counting the associations.
     */
    (options?: HasManyCountAssociationsMixinOptions<TInstance>): Promise<number>
  }


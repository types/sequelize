
import {Association, ManyToManyOptions, AssociationScope, ForeignKeyOptions} from './base';
import {DataType} from '../data-types';
import {Transaction} from '../transaction';
import {Promise} from '../promise';
import {
  Model,
  ColumnOptions,
  WhereOptions,
  FindOptions,
  BulkCreateOptions,
  InstanceUpdateOptions,
  InstanceDestroyOptions,
  CreateOptions
} from '../model';

/**
 * Used for a association table in n:m associations.
 */
export interface ThroughOptions {

  /**
   * The model used to join both sides of the N:M association.
   */
  model: typeof Model;

  /**
   * A key/value set that will be used for association create and find defaults on the through model.
   * (Remember to add the attributes to the through model)
   */
  scope?: AssociationScope;

  /**
   * If true a unique key will be generated from the foreign keys used (might want to turn this off and create
   * specific unique keys when using scopes)
   *
   * Defaults to true
   */
  unique?: boolean;
}

/**
 * Options provided when associating models with belongsToMany relationship
 */
export interface BelongsToManyOptions extends ManyToManyOptions {

  /**
   * The name of the table that is used to join source and target in n:m associations. Can also be a
   * sequelize model if you want to define the junction table yourself and add extra attributes to it.
   */
  through: typeof Model | string | ThroughOptions;

  /**
   * The name of the foreign key in the join table (representing the target model) or an object representing
   * the type definition for the other column (see `Sequelize.define` for syntax). When using an object, you
   * can add a `name` property to set the name of the colum. Defaults to the name of target + primary key of
   * target
   */
  otherKey?: string | ForeignKeyOptions;
}

export class BelongsToMany extends Association {
  constructor(source: typeof Model, target: typeof Model, options: BelongsToManyOptions);
}


/**
 * The options for the getAssociations mixin of the belongsToMany association.
 * @see BelongsToManyGetAssociationsMixin
 */
export interface BelongsToManyGetAssociationsMixinOptions {

  /**
   * An optional where clause to limit the associated models.
   */
  where?: WhereOptions;

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
 * The getAssociations mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsToMany(Role, { through: UserRole });
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *    getRoles: Sequelize.BelongsToManyGetAssociationsMixin<RoleInstance>;
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
 * @see http://docs.sequelizejs.com/en/latest/api/associations/belongs-to-many/
 * @see Instance
 */
export interface BelongsToManyGetAssociationsMixin<TModel> {
  /**
   * Get everything currently associated with this, using an optional where clause.
   * @param options The options to use when getting the associations.
   */
  (options?: BelongsToManyGetAssociationsMixinOptions): Promise<TModel[]>
}

/**
 * The options for the setAssociations mixin of the belongsToMany association.
 * @see BelongsToManySetAssociationsMixin
 */
export interface BelongsToManySetAssociationsMixinOptions {

  /**
   * Run validation for the join model.
   */
  validate?: boolean;

  /**
   * Transaction to run query under
   */
  transaction?: Transaction;
}

/**
 * The setAssociations mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsToMany(Role, { through: UserRole });
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *    // getRoles...
 *    setRoles: Sequelize.BelongsToManySetAssociationsMixin<RoleInstance, RoleId, UserRoleAttributes>;
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
 * @see http://docs.sequelizejs.com/en/latest/api/associations/belongs-to-many/
 * @see Instance
 */
export interface BelongsToManySetAssociationsMixin<TModel, TModelPrimaryKey, TJoinTableAttributes> {
  /**
   * Set the associated models by passing an array of instances or their primary keys.
   * Everything that it not in the passed array will be un-associated.
   * @param newAssociations An array of instances or primary key of instances to associate with this. Pass null or undefined to remove all associations.
   * @param options The options passed to `through.findAll`, `bulkCreate`, `update` and `destroy`. Can also hold additional attributes for the join table.
   */
  (
    newAssociations?: Array<TModel | TModelPrimaryKey>,
    options?: BelongsToManySetAssociationsMixinOptions | FindOptions | BulkCreateOptions | InstanceUpdateOptions | InstanceDestroyOptions | TJoinTableAttributes
  ): Promise<void>
}

/**
 * The options for the addAssociations mixin of the belongsToMany association.
 * @see BelongsToManyAddAssociationsMixin
 */
export interface BelongsToManyAddAssociationsMixinOptions {

  /**
   * Run validation for the join model.
   */
  validate?: boolean;

  /**
   * Transaction to run query under
   */
  transaction?: Transaction;
}

/**
 * The addAssociations mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsToMany(Role, { through: UserRole });
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *    // getRoles...
 *    // setRoles...
 *    addRoles: Sequelize.BelongsToManyAddAssociationsMixin<RoleInstance, RoleId, UserRoleAttributes>;
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
 * @see http://docs.sequelizejs.com/en/latest/api/associations/belongs-to-many/
 * @see Instance
 */
export interface BelongsToManyAddAssociationsMixin<TModel, TModelPrimaryKey, TJoinTableAttributes> {
  /**
   * Associate several instances with this.
   * @param newAssociations An array of instances or primary key of instances to associate with this.
   * @param options The options passed to `through.findAll`, `bulkCreate`, `update` and `destroy`. Can also hold additional attributes for the join table.
   */
  (
    newAssociations?: Array<TModel | TModelPrimaryKey>,
    options?: BelongsToManyAddAssociationsMixinOptions | FindOptions | BulkCreateOptions | InstanceUpdateOptions | InstanceDestroyOptions | TJoinTableAttributes
  ): Promise<void>
}

/**
 * The options for the addAssociation mixin of the belongsToMany association.
 * @see BelongsToManyAddAssociationMixin
 */
export interface BelongsToManyAddAssociationMixinOptions {

  /**
   * Run validation for the join model.
   */
  validate?: boolean;
}

/**
 * The addAssociation mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsToMany(Role, { through: UserRole });
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *    // getRoles...
 *    // setRoles...
 *    // addRoles...
 *    addRole: Sequelize.BelongsToManyAddAssociationMixin<RoleInstance, RoleId, UserRoleAttributes>;
 *    // createRole...
 *    // removeRole...
 *    // removeRoles...
 *    // hasRole...
 *    // hasRoles...
 *    // countRoles...
 * }
 * ```
 *
 * @see http://docs.sequelizejs.com/en/latest/api/associations/belongs-to-many/
 * @see Instance
 */
export interface BelongsToManyAddAssociationMixin<TModel, TModelPrimaryKey, TJoinTableAttributes> {
  /**
   * Associate an instance with this.
   * @param newAssociation An instance or the primary key of an instance to associate with this.
   * @param options The options passed to `through.findAll`, `bulkCreate`, `update` and `destroy`. Can also hold additional attributes for the join table.
   */
  (
    newAssociation?: TModel | TModelPrimaryKey,
    options?: BelongsToManyAddAssociationMixinOptions | FindOptions | BulkCreateOptions | InstanceUpdateOptions | InstanceDestroyOptions | TJoinTableAttributes
  ): Promise<void>
}

/**
 * The options for the createAssociation mixin of the belongsToMany association.
 * @see BelongsToManyCreateAssociationMixin
 */
export interface BelongsToManyCreateAssociationMixinOptions { }

/**
 * The createAssociation mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsToMany(Role, { through: UserRole });
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *    // getRoles...
 *    // setRoles...
 *    // addRoles...
 *    // addRole...
 *    createRole: Sequelize.BelongsToManyCreateAssociationMixin<RoleAttributes, UserRoleAttributes>;
 *    // removeRole...
 *    // removeRoles...
 *    // hasRole...
 *    // hasRoles...
 *    // countRoles...
 * }
 * ```
 *
 * @see http://docs.sequelizejs.com/en/latest/api/associations/belongs-to-many/
 * @see Instance
 */
export interface BelongsToManyCreateAssociationMixin<TAttributes, TModel, TJoinTableAttributes> {
  /**
   * Create a new instance of the associated model and associate it with this.
   * @param values The values used to create the association.
   * @param options Options passed to `create` and `add`. Can also hold additional attributes for the join table.
   */
  (
    values?: TAttributes,
    options?: BelongsToManyCreateAssociationMixinOptions | CreateOptions | TJoinTableAttributes
  ): Promise<TModel>
}

/**
 * The options for the removeAssociation mixin of the belongsToMany association.
 * @see BelongsToManyRemoveAssociationMixin
 */
export interface BelongsToManyRemoveAssociationMixinOptions { }

/**
 * The removeAssociation mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsToMany(Role, { through: UserRole });
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *    // getRoles...
 *    // setRoles...
 *    // addRoles...
 *    // addRole...
 *    // createRole...
 *    removeRole: Sequelize.BelongsToManyRemoveAssociationMixin<RoleInstance, RoleId>;
 *    // removeRoles...
 *    // hasRole...
 *    // hasRoles...
 *    // countRoles...
 * }
 * ```
 *
 * @see http://docs.sequelizejs.com/en/latest/api/associations/belongs-to-many/
 * @see Instance
 */
export interface BelongsToManyRemoveAssociationMixin<TModel, TModelPrimaryKey> {
  /**
   * Un-associate the instance.
   * @param oldAssociated The instance or the primary key of the instance to un-associate.
   * @param options The options passed to `through.destroy`.
   */
  (
    oldAssociated?: TModel | TModelPrimaryKey,
    options?: BelongsToManyRemoveAssociationMixinOptions | InstanceDestroyOptions
  ): Promise<void>
}

/**
 * The options for the removeAssociations mixin of the belongsToMany association.
 * @see BelongsToManyRemoveAssociationsMixin
 */
export interface BelongsToManyRemoveAssociationsMixinOptions {
  /**
   * Transaction to run query under
   */
  transaction?: Transaction;
}

/**
 * The removeAssociations mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsToMany(Role, { through: UserRole });
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *    // getRoles...
 *    // setRoles...
 *    // addRoles...
 *    // addRole...
 *    // createRole...
 *    // removeRole...
 *    removeRoles: Sequelize.BelongsToManyRemoveAssociationsMixin<RoleInstance, RoleId>;
 *    // hasRole...
 *    // hasRoles...
 *    // countRoles...
 * }
 * ```
 *
 * @see http://docs.sequelizejs.com/en/latest/api/associations/belongs-to-many/
 * @see Instance
 */
export interface BelongsToManyRemoveAssociationsMixin<TModel, TModelPrimaryKey> {
  /**
   * Un-associate several instances.
   * @param oldAssociated An array of instances or primary key of instances to un-associate.
   * @param options The options passed to `through.destroy`.
   */
  (
    oldAssociateds?: Array<TModel | TModelPrimaryKey>,
    options?: BelongsToManyRemoveAssociationsMixinOptions | InstanceDestroyOptions
  ): Promise<void>
}

/**
 * The options for the hasAssociation mixin of the belongsToMany association.
 * @see BelongsToManyHasAssociationMixin
 */
export interface BelongsToManyHasAssociationMixinOptions { }

/**
 * The hasAssociation mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsToMany(Role, { through: UserRole });
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *    // getRoles...
 *    // setRoles...
 *    // addRoles...
 *    // addRole...
 *    // createRole...
 *    // removeRole...
 *    // removeRoles...
 *    hasRole: Sequelize.BelongsToManyHasAssociationMixin<RoleInstance, RoleId>;
 *    // hasRoles...
 *    // countRoles...
 * }
 * ```
 *
 * @see http://docs.sequelizejs.com/en/latest/api/associations/belongs-to-many/
 * @see Instance
 */
export interface BelongsToManyHasAssociationMixin<TModel, TModelPrimaryKey> {
  /**
   * Check if an instance is associated with this.
   * @param target The instance or the primary key of the instance to check.
   * @param options The options passed to `getAssociations`.
   */
  (
    target: TModel | TModelPrimaryKey,
    options?: BelongsToManyHasAssociationMixinOptions | BelongsToManyGetAssociationsMixinOptions
  ): Promise<boolean>
}

/**
 * The options for the hasAssociations mixin of the belongsToMany association.
 * @see BelongsToManyHasAssociationsMixin
 */
export interface BelongsToManyHasAssociationsMixinOptions {
  /**
   * Transaction to run query under
   */
  transaction?: Transaction;
}

/**
 * The removeAssociations mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsToMany(Role, { through: UserRole });
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
 *    hasRoles: Sequelize.BelongsToManyHasAssociationsMixin<RoleInstance, RoleId>;
 *    // countRoles...
 * }
 * ```
 *
 * @see http://docs.sequelizejs.com/en/latest/api/associations/belongs-to-many/
 * @see Instance
 */
export interface BelongsToManyHasAssociationsMixin<TModel, TModelPrimaryKey> {
  /**
   * Check if all instances are associated with this.
   * @param targets An array of instances or primary key of instances to check.
   * @param options The options passed to `getAssociations`.
   */
  (
    targets: Array<TModel | TModelPrimaryKey>,
    options?: BelongsToManyHasAssociationsMixinOptions | BelongsToManyGetAssociationsMixinOptions
  ): Promise<boolean>
}

/**
 * The options for the countAssociations mixin of the belongsToMany association.
 * @see BelongsToManyCountAssociationsMixin
 */
export interface BelongsToManyCountAssociationsMixinOptions {

  /**
   * An optional where clause to limit the associated models.
   */
  where?: WhereOptions;

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
 * The countAssociations mixin applied to models with belongsToMany.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsToMany(Role, { through: UserRole });
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
 *    countRoles: Sequelize.BelongsToManyCountAssociationsMixin;
 * }
 * ```
 *
 * @see http://docs.sequelizejs.com/en/latest/api/associations/belongs-to-many/
 * @see Instance
 */
export interface BelongsToManyCountAssociationsMixin {
  /**
   * Count everything currently associated with this, using an optional where clause.
   * @param options The options to use when counting the associations.
   */
  (options?: BelongsToManyCountAssociationsMixinOptions): Promise<number>
}

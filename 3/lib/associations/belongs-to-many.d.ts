
import {
  Association,
  ManyToManyOptions,
  AssociationScope,
  ForeignKeyOptions,
  MultiAssociationAccessors
} from './base';
import {Transaction} from '../../index';
import Promise = require('../promise');
import {
  Model,
  Instance,
  WhereOptions,
  FindOptions,
  BulkCreateOptions,
  InstanceUpdateOptions,
  InstanceDestroyOptions,
  CreateOptions
} from '../../index';

/**
 * Used for a association table in n:m associations.
 */
export interface ThroughOptions {

  /**
   * The model used to join both sides of the N:M association.
   */
  model: Model<Instance>;

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
 * Attributes for the join table
 */
export interface JoinTableAttributes {
  [attribute: string]: any;
}

/**
 * Options provided when associating models with belongsToMany relationship
 */
export interface BelongsToManyOptions extends ManyToManyOptions {

  /**
   * The name of the table that is used to join source and target in n:m associations. Can also be a
   * sequelize model if you want to define the junction table yourself and add extra attributes to it.
   */
  through: Model<Instance> | string | ThroughOptions;

  /**
   * The name of the foreign key in the join table (representing the target model) or an object representing
   * the type definition for the other column (see `Sequelize.define` for syntax). When using an object, you
   * can add a `name` property to set the name of the colum. Defaults to the name of target + primary key of
   * target
   */
  otherKey?: string | ForeignKeyOptions;

  /**
   * Should the join model have timestamps
   */
  timestamps?: boolean;
}

export class BelongsToMany<TSource extends Model<Instance>, TTarget extends Model<Instance>> extends Association<TSource, TTarget> {
  otherKey: string;
  accessors: MultiAssociationAccessors;
  constructor(source: TSource, target: TTarget, options: BelongsToManyOptions);
}


/**
 * The options for the getAssociations mixin of the belongsToMany association.
 * @see BelongsToManyGetAssociationsMixin
 */
export interface BelongsToManyGetAssociationsMixinOptions<TInstance extends Instance> {

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
export interface BelongsToManyGetAssociationsMixin<TInstance extends Instance> {
  /**
   * Get everything currently associated with this, using an optional where clause.
   * @param options The options to use when getting the associations.
   */
  (options?: BelongsToManyGetAssociationsMixinOptions<TInstance>): Promise<TInstance[]>
}

/**
 * The options for the setAssociations mixin of the belongsToMany association.
 * @see BelongsToManySetAssociationsMixin
 */
export interface BelongsToManySetAssociationsMixinOptions<TModel extends Model<TInstance>, TInstance extends Instance> extends
  FindOptions<TModel, TInstance>,
  BulkCreateOptions<TInstance>,
  InstanceUpdateOptions<TInstance>,
  InstanceDestroyOptions,
  JoinTableAttributes { }

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
export interface BelongsToManySetAssociationsMixin<TModel extends Model<TInstance>, TInstance extends Instance, TPrimaryKey> {
  /**
   * Set the associated models by passing an array of instances or their primary keys.
   * Everything that it not in the passed array will be un-associated.
   * @param newAssociations An array of instances or primary key of instances to associate with this. Pass null or undefined to remove all associations.
   * @param options The options passed to `through.findAll`, `bulkCreate`, `update` and `destroy`. Can also hold additional attributes for the join table.
   */
  (
    newAssociations?: Array<TInstance | TPrimaryKey>,
    options?: BelongsToManySetAssociationsMixinOptions<TModel, TInstance>
  ): Promise<void>
}

/**
 * The options for the addAssociations mixin of the belongsToMany association.
 * @see BelongsToManyAddAssociationsMixin
 */
export interface BelongsToManyAddAssociationsMixinOptions<TModel extends Model<TInstance>, TInstance extends Instance> extends
  FindOptions<TModel, TInstance>,
  BulkCreateOptions<TInstance>,
  InstanceUpdateOptions<TInstance>,
  InstanceDestroyOptions,
  JoinTableAttributes { }

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
export interface BelongsToManyAddAssociationsMixin<TModel extends Model<TInstance>, TInstance extends Instance, TPrimaryKey> {
  /**
   * Associate several instances with this.
   * @param newAssociations An array of instances or primary key of instances to associate with this.
   * @param options The options passed to `through.findAll`, `bulkCreate`, `update` and `destroy`. Can also hold additional attributes for the join table.
   */
  (
    newAssociations?: Array<TInstance | TPrimaryKey>,
    options?: BelongsToManyAddAssociationsMixinOptions<TModel, TInstance>
  ): Promise<void>
}

/**
 * The options for the addAssociation mixin of the belongsToMany association.
 * @see BelongsToManyAddAssociationMixin
 */
export interface BelongsToManyAddAssociationMixinOptions<TModel extends Model<TInstance>, TInstance extends Instance> extends
  FindOptions<TModel, TInstance>,
  BulkCreateOptions<TInstance>,
  InstanceUpdateOptions<TInstance>,
  InstanceDestroyOptions,
  JoinTableAttributes { }

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
export interface BelongsToManyAddAssociationMixin<TModel extends Model<TInstance>, TInstance extends Instance, TPrimaryKey> {
  /**
   * Associate an instance with this.
   * @param newAssociation An instance or the primary key of an instance to associate with this.
   * @param options The options passed to `through.findAll`, `bulkCreate`, `update` and `destroy`. Can also hold additional attributes for the join table.
   */
  (
    newAssociation?: TInstance | TPrimaryKey,
    options?: BelongsToManyAddAssociationMixinOptions<TModel, TInstance>
  ): Promise<void>
}

/**
 * The options for the createAssociation mixin of the belongsToMany association.
 * @see BelongsToManyCreateAssociationMixin
 */
export interface BelongsToManyCreateAssociationMixinOptions<TModel extends Model<TInstance>, TInstance extends Instance> extends
  CreateOptions<TModel, TInstance>,
  JoinTableAttributes { }
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
export interface BelongsToManyCreateAssociationMixin<TModel extends Model<TInstance>, TInstance extends Instance> {
  /**
   * Create a new instance of the associated model and associate it with this.
   * @param values The values used to create the association.
   * @param options Options passed to `create` and `add`. Can also hold additional attributes for the join table.
   */
  (
    values?: Partial<TInstance>,
    options?: BelongsToManyCreateAssociationMixinOptions<TModel, TInstance>
  ): Promise<TInstance>
}

/**
 * The options for the removeAssociation mixin of the belongsToMany association.
 * @see BelongsToManyRemoveAssociationMixin
 */
export interface BelongsToManyRemoveAssociationMixinOptions extends InstanceDestroyOptions { }

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
export interface BelongsToManyRemoveAssociationMixin<TInstance extends Instance, TPrimaryKey> {
  /**
   * Un-associate the instance.
   * @param oldAssociated The instance or the primary key of the instance to un-associate.
   * @param options The options passed to `through.destroy`.
   */
  (
    oldAssociated?: TInstance | TPrimaryKey,
    options?: BelongsToManyRemoveAssociationMixinOptions
  ): Promise<void>
}

/**
 * The options for the removeAssociations mixin of the belongsToMany association.
 * @see BelongsToManyRemoveAssociationsMixin
 */
export interface BelongsToManyRemoveAssociationsMixinOptions extends InstanceDestroyOptions, InstanceDestroyOptions { }

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
export interface BelongsToManyRemoveAssociationsMixin<TInstance extends Instance, TPrimaryKey> {
  /**
   * Un-associate several instances.
   * @param oldAssociated An array of instances or primary key of instances to un-associate.
   * @param options The options passed to `through.destroy`.
   */
  (
    oldAssociateds?: Array<TInstance | TPrimaryKey>,
    options?: BelongsToManyRemoveAssociationsMixinOptions
  ): Promise<void>
}

/**
 * The options for the hasAssociation mixin of the belongsToMany association.
 * @see BelongsToManyHasAssociationMixin
 */
export interface BelongsToManyHasAssociationMixinOptions<TInstance extends Instance> extends BelongsToManyGetAssociationsMixinOptions<TInstance> { }

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
export interface BelongsToManyHasAssociationMixin<TInstance extends Instance, TPrimaryKey> {
  /**
   * Check if an instance is associated with this.
   * @param target The instance or the primary key of the instance to check.
   * @param options The options passed to `getAssociations`.
   */
  (
    target: TInstance | TPrimaryKey,
    options?: BelongsToManyHasAssociationMixinOptions<TInstance>
  ): Promise<boolean>
}

/**
 * The options for the hasAssociations mixin of the belongsToMany association.
 * @see BelongsToManyHasAssociationsMixin
 */
export interface BelongsToManyHasAssociationsMixinOptions<TInstance extends Instance> extends BelongsToManyGetAssociationsMixinOptions<TInstance> { }

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
export interface BelongsToManyHasAssociationsMixin<TInstance extends Instance, TPrimaryKey> {
  /**
   * Check if all instances are associated with this.
   * @param targets An array of instances or primary key of instances to check.
   * @param options The options passed to `getAssociations`.
   */
  (
    targets: Array<TInstance | TPrimaryKey>,
    options?: BelongsToManyHasAssociationsMixinOptions<TInstance>
  ): Promise<boolean>
}

/**
 * The options for the countAssociations mixin of the belongsToMany association.
 * @see BelongsToManyCountAssociationsMixin
 */
export interface BelongsToManyCountAssociationsMixinOptions<TInstance extends Instance> {

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
export interface BelongsToManyCountAssociationsMixin<TInstance extends Instance> {
  /**
   * Count everything currently associated with this, using an optional where clause.
   * @param options The options to use when counting the associations.
   */
  (options?: BelongsToManyCountAssociationsMixinOptions<TInstance>): Promise<number>
}

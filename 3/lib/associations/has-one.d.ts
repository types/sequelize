
import {Association, AssociationOptions, SingleAssociationAccessors} from './base';
import {Model, CreateOptions} from '../model';
import {Instance, InstanceSaveOptions} from '../instance';
import {DataType} from '../data-types';
import Promise from '../promise';

/**
 * Options provided when associating models with hasOne relationship
 */
export interface HasOneOptions extends AssociationOptions {

  /**
   * A string or a data type to represent the identifier in the table
   */
  keyType?: DataType;
}

export class HasOne<TSourceModel extends Model<Instance>, TTargetModel extends Model<Instance>> extends Association<TSourceModel, TTargetModel> {
  accessors: SingleAssociationAccessors;
  constructor(source: TSourceModel, target: TTargetModel, options: HasOneOptions);
}


/**
 * The options for the getAssociation mixin of the hasOne association.
 * @see HasOneGetAssociationMixin
 */
export interface HasOneGetAssociationMixinOptions {
  /**
   * Apply a scope on the related model, or remove its default scope by passing false.
   */
  scope?: string | boolean;
}

/**
 * The getAssociation mixin applied to models with hasOne.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.hasOne(Role);
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttrib>, UserAttrib {
 *    getRole: Sequelize.HasOneGetAssociationMixin<RoleInstance>;
 *    // setRole...
 *    // createRole...
 * }
 * ```
 *
 * @see http://docs.sequelizejs.com/en/latest/api/associations/has-one/
 * @see Instance
 */
export interface HasOneGetAssociationMixin<TInstance extends Instance> {
  /**
   * Get the associated instance.
   * @param options The options to use when getting the association.
   */
  (options?: HasOneGetAssociationMixinOptions): Promise<TInstance>
}

/**
 * The options for the setAssociation mixin of the hasOne association.
 * @see HasOneSetAssociationMixin
 */
export interface HasOneSetAssociationMixinOptions<TInstance extends Instance> extends HasOneGetAssociationMixinOptions, InstanceSaveOptions<TInstance> {
  /**
   * Skip saving this after setting the foreign key if false.
   */
  save?: boolean;
}

/**
 * The setAssociation mixin applied to models with hasOne.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.hasOne(Role);
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *    // getRole...
 *    setRole: Sequelize.HasOneSetAssociationMixin<RoleInstance, RoleId>;
 *    // createRole...
 * }
 * ```
 *
 * @see http://docs.sequelizejs.com/en/latest/api/associations/has-one/
 * @see Instance
 */
export interface HasOneSetAssociationMixin<TInstance extends Instance, TPrimaryKey> {
  /**
   * Set the associated instance.
   * @param newAssociation An instance or the primary key of an instance to associate with this. Pass null or undefined to remove the association.
   * @param options The options passed to `getAssocation` and `target.save`.
   */
  (
    newAssociation?: TInstance | TPrimaryKey,
    options?: HasOneSetAssociationMixinOptions<TInstance>
  ): Promise<void>
}

/**
 * The options for the createAssociation mixin of the hasOne association.
 * @see HasOneCreateAssociationMixin
 */
export interface HasOneCreateAssociationMixinOptions<TModel extends Model<TInstance>, TInstance extends Instance> extends
  HasOneSetAssociationMixinOptions<TInstance>,
  CreateOptions<TModel, TInstance> { }


/**
 * The createAssociation mixin applied to models with hasOne.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.hasOne(Role);
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *    // getRole...
 *    // setRole...
 *    createRole: Sequelize.HasOneCreateAssociationMixin<RoleAttributes>;
 * }
 * ```
 *
 * @see http://docs.sequelizejs.com/en/latest/api/associations/has-one/
 * @see Instance
 */
export interface HasOneCreateAssociationMixin<TModel extends Model<TInstance>, TInstance extends Instance> {
  /**
   * Create a new instance of the associated model and associate it with this.
   * @param values The values used to create the association.
   * @param options The options passed to `target.create` and `setAssociation`.
   */
  (
    values?: Partial<TInstance>,
    options?: HasOneCreateAssociationMixinOptions<TModel, TInstance>
  ): Promise<TInstance>
}

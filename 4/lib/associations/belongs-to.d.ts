
import {Association} from './base';
import {Model, SaveOptions, CreateOptions} from '../model';
import {DataType} from '../data-types';
import {AssociationOptions} from './base';
import {Promise} from '../promise';

/**
 * Options provided when associating models with belongsTo relationship
 *
 * @see Association class belongsTo method
 */
export interface BelongsToOptions extends AssociationOptions {

  /**
   * The name of the field to use as the key for the association in the target table. Defaults to the primary
   * key of the target table
   */
  targetKey?: string;

  /**
   * A string or a data type to represent the identifier in the table
   */
  keyType?: DataType;

}

export class BelongsTo extends Association {
  constructor(source: typeof Model, target: typeof Model, options: BelongsToOptions);
}


/**
 * The options for the getAssociation mixin of the belongsTo association.
 * @see BelongsToGetAssociationMixin
 */
export interface BelongsToGetAssociationMixinOptions {
  /**
   * Apply a scope on the related model, or remove its default scope by passing false.
   */
  scope?: string | boolean;
}

/**
 * The getAssociation mixin applied to models with belongsTo.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsTo(Role);
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttrib>, UserAttrib {
 *    getRole: Sequelize.BelongsToGetAssociationMixin<RoleInstance>;
 *    // setRole...
 *    // createRole...
 * }
 * ```
 *
 * @see http://docs.sequelizejs.com/en/latest/api/associations/belongs-to/
 * @see Instance
 */
export interface BelongsToGetAssociationMixin<TModel> {
  /**
   * Get the associated instance.
   * @param options The options to use when getting the association.
   */
  (options?: BelongsToGetAssociationMixinOptions): Promise<TModel>
}

/**
 * The options for the setAssociation mixin of the belongsTo association.
 * @see BelongsToSetAssociationMixin
 */
export interface BelongsToSetAssociationMixinOptions {
  /**
   * Skip saving this after setting the foreign key if false.
   */
  save?: boolean;
}

/**
 * The setAssociation mixin applied to models with belongsTo.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsTo(Role);
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *    // getRole...
 *    setRole: Sequelize.BelongsToSetAssociationMixin<RoleInstance, RoleId>;
 *    // createRole...
 * }
 * ```
 *
 * @see http://docs.sequelizejs.com/en/latest/api/associations/belongs-to/
 * @see Instance
 */
export interface BelongsToSetAssociationMixin<TModel, TPrimaryKey> {
  /**
   * Set the associated instance.
   * @param newAssociation An instance or the primary key of an instance to associate with this. Pass null or undefined to remove the association.
   * @param options the options passed to `this.save`.
   */
  (newAssociation?: TModel | TPrimaryKey, options?: BelongsToSetAssociationMixinOptions | SaveOptions): Promise<void>
}

/**
 * The options for the createAssociation mixin of the belongsTo association.
 * @see BelongsToCreateAssociationMixin
 */
export interface BelongsToCreateAssociationMixinOptions { }

/**
 * The createAssociation mixin applied to models with belongsTo.
 * An example of usage is as follows:
 *
 * ```js
 *
 * User.belongsTo(Role);
 *
 * interface UserInstance extends Sequelize.Instance<UserInstance, UserAttributes>, UserAttributes {
 *    // getRole...
 *    // setRole...
 *    createRole: Sequelize.BelongsToCreateAssociationMixin<RoleAttributes>;
 * }
 * ```
 *
 * @see http://docs.sequelizejs.com/en/latest/api/associations/belongs-to/
 * @see Instance
 */
export interface BelongsToCreateAssociationMixin<TModel> {
  /**
   * Create a new instance of the associated model and associate it with this.
   * @param values The values used to create the association.
   * @param options The options passed to `target.create` and `setAssociation`.
   */
  (
    values?: Object,
    options?: BelongsToCreateAssociationMixinOptions | CreateOptions | BelongsToSetAssociationMixinOptions
  ): Promise<TModel>
}

export default BelongsTo;

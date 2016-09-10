
import {
  Model,
  BelongsTo,
  FindOptions,
  DataTypes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin
} from 'sequelize';
import {sequelize} from '../connection';

export class User extends Model {

  static associations: {
    group: BelongsTo
  };

  id: number;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;

  // mixins for association (optional)
  groupId: number;
  group: UserGroup;
  getGroup: BelongsToGetAssociationMixin<UserGroup>;
  setGroup: BelongsToSetAssociationMixin<UserGroup, number>;
  createGroup: BelongsToCreateAssociationMixin<UserGroup>;
}

User.init({
  username: DataTypes.STRING,
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING
}, { sequelize });

// Hooks
User.afterFind((users: User[], options: FindOptions) => {
  console.log('found');
});

// associate
// it is important to import _after_ the model above is already exported so the circular reference works.
import {UserGroup} from './UserGroup';
export const Group = User.belongsTo(UserGroup, {as: 'group', foreignKey: 'groupId'});

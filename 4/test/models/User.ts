
import {
  Model,
  FindOptions,
  STRING,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin
} from 'sequelize';
import {sequelize} from '../connection';

export class User extends Model {

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
  username: STRING,
  firstName: STRING,
  lastName: STRING
}, {}, sequelize.modelManager);

// Hooks
User.afterFind((users: User[], options: FindOptions) => {
  console.log('found');
});

// associate
// it is important to import _after_ the model above is already exported so the circular reference works.
import {UserGroup} from './UserGroup';
export const Group = User.belongsTo(UserGroup, {as: 'group', foreignKey: 'groupId'});

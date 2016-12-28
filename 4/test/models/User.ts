
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

interface INst {}

export const User = class User extends Model {
  firstName: string;
}

User.find()

const u = new User({firstName: 'hello'});

User.init({
  username: DataTypes.STRING,
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING
}, { sequelize });

// Hooks
User.afterFind((users: User[], options: FindOptions<typeof User, User>) => {
  console.log('found');
});

// associate
// it is important to import _after_ the model above is already exported so the circular reference works.
import {UserGroup} from './UserGroup';
export const Group = User.belongsTo(UserGroup, {as: 'group', foreignKey: 'groupId'});

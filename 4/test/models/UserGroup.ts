import {sequelize} from '../connection';
import {
  Model,
  HasMany,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin
} from 'sequelize';

export class UserGroup extends Model<UserGroup> {

  static associations: {
    users: HasMany
  };

  id: number;
  name: string;

  // mixins for association (optional)
  users: User[];
  getUsers: HasManyGetAssociationsMixin<User>;
  setUsers: HasManySetAssociationsMixin<User, number>;
  addUser: HasManyAddAssociationMixin<User, number>;
  addUsers: HasManyAddAssociationsMixin<User, number>;
  createUser: HasManyCreateAssociationMixin<number>;
  countUsers: HasManyCountAssociationsMixin;
  hasUser: HasManyHasAssociationMixin<User, number>;
  removeUser: HasManyRemoveAssociationMixin<User, number>;
  removeUsers: HasManyRemoveAssociationsMixin<User, number>;
}

// attach all the metadata to the model
// instead of this, you could also use decorators
UserGroup.init({ name: DataTypes.STRING }, { sequelize });

// associate
// it is important to import _after_ the model above is already exported so the circular reference works.
import {User} from './User';
export const Users = UserGroup.hasMany(User, {as: 'users', foreignKey: 'groupId'});

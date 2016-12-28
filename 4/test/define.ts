
import {DataTypes, Model, Instance} from 'sequelize';
import {sequelize} from './connection';

// I really wouldn't recommend this, but if you want you can still use define() and interfaces

interface UserInstance extends Instance {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User extends Model<UserInstance> {
  customStaticMethod(): any;
}

const User = sequelize.define<User, UserInstance>('User', {
  firstName: DataTypes.STRING
}, {
  tableName: 'users'
});

async function test() {

  User.customStaticMethod();

  const user: UserInstance = new User();

  const user2: UserInstance = await User.find();

  user2.firstName = 'John';

  await user2.save();
}

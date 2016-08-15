
import {DataTypes, Model} from 'sequelize';
import {sequelize} from './connection';

// I really wouldn't recommend this, but if you want you can still use define() and interfaces

type UserInstance = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
} & Model;

type User = {
  new (): UserInstance;
  customStaticMethod(): any;
} & typeof Model;

const User: User = sequelize.define<User>('User', {firstName: DataTypes.STRING}, {tableName: 'users'});

async function test() {

  User.customStaticMethod();

  const user: UserInstance = new User();

  const user2: UserInstance = await User.find() as UserInstance;

  user2.firstName = 'John';

  await user2.save();
}


import {User, Group} from './models/User';

async function test(): Promise<User> {

  const user = await User.findOne({include: [Group]});
  User.update({  }, { where: {} });
  user.firstName = 'John';
  await user.save();
  await user.setGroup(2);

  new User();
  new User({firstName: 'John'});

  const user2 = await User.create({firstName: 'John', groupId: 1});
  await User.findAndCountAll({ distinct: true });
  return user2;
}

test();

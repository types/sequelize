
import {User, Group} from './models/User';

async function test(): Promise<void> {

  const user = await User.findOne({include: [Group]}) as User;
  user.firstName = 'John';
  await user.save();
  await user.setGroup(2);

  new User();
  new User({firstName: 'John'});
  
  const group = await Group.create({name: 'Test Group'}) as Group;
  await group.setUsers([user]);

  const user2 = await User.create({firstName: 'John', groupId: 1}) as User;
}

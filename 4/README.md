# Typed Sequelize@4
[![Build Status](https://travis-ci.org/types/npm-sequelize.svg?branch=master)](https://travis-ci.org/types/npm-sequelize)

Typescript Typings for [Sequelize](http://sequelizejs.com).

## [API Documentation](http://typed-sequelize.surge.sh/v4)

## Installation

```bash
typings install --save sequelize@4.0.0-1
```

## Usage

```ts
import {
  Model,
  FindOptions,
  STRING,
  BelongsTo,
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
  username: STRING,
  firstName: STRING,
  lastName: STRING
}, { sequelize });

// associate
// it is important to import _after_ the model above is already exported so the circular reference works.
import {UserGroup} from './UserGroup';
User.belongsTo(UserGroup, {as: 'group', foreignKey: 'groupId'});
```

```ts
import {User, Group} from './models/User';

async function test() {

  const user = await User.findOne({include: [Group]}) as User;
  user.firstName = 'John';
  await user.save();
  await user.setGroup(2);

  new User();
  new User({firstName: 'John'});

  const user2 = await User.create({firstName: 'John', groupId: 1}) as User;
}
```

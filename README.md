# Typescript Typings for [Sequelize](http://sequelizejs.com).

[![build](https://travis-ci.org/types/sequelize.svg?branch=master)](https://travis-ci.org/types/sequelize)
[![dependencies](https://david-dm.org/types/sequelize/status.svg)](https://david-dm.org/types/sequelize)
[![devDependencies](https://david-dm.org/types/sequelize/dev-status.svg)](https://david-dm.org/types/sequelize?type=dev)
[![peerDependencies](https://david-dm.org/types/sequelize/peer-status.svg)](https://david-dm.org/types/sequelize?type=peer)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## [API Documentation](https://typed-sequelize.surge.sh)

## Installation

```bash
npm install --save-dev types/sequelize#<commit hash>
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
    BelongsToCreateAssociationMixin,
} from 'sequelize'
import { sequelize } from '../connection'

export class User extends Model {
    static associations: {
        group: BelongsTo
    }

    id: number
    username: string
    firstName: string
    lastName: string
    createdAt: Date
    updatedAt: Date

    // mixins for association (optional)
    groupId: number
    group: UserGroup
    getGroup: BelongsToGetAssociationMixin<UserGroup>
    setGroup: BelongsToSetAssociationMixin<UserGroup, number>
    createGroup: BelongsToCreateAssociationMixin<UserGroup>
}

User.init(
    {
        username: STRING,
        firstName: STRING,
        lastName: STRING,
    },
    { sequelize }
)

// associate
// it is important to import _after_ the model above is already exported so the circular reference works.
import { UserGroup } from './UserGroup'
User.belongsTo(UserGroup, { as: 'group', foreignKey: 'groupId' })
```

```ts
import { User, Group } from './models/User'

async function test() {
    const user = (await User.findOne({ include: [Group] })) as User
    user.firstName = 'John'
    await user.save()
    await user.setGroup(2)

    new User()
    new User({ firstName: 'John' })

    const user2 = (await User.create({ firstName: 'John', groupId: 1 })) as User
}
```

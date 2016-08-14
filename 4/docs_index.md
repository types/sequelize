
_Start typing to search_

## API
<ul class="tsd-index-list" style="list-style: none">
  <li class="tsd-kind-class"><a class="tsd-kind-icon" href="classes/_lib_sequelize_d_.sequelize.html">Sequelize</a></li>
  <li class="tsd-kind-class"><a class="tsd-kind-icon" href="classses/_lib_model_d_.model.html">Model</a></li>
  <li class="tsd-kind-class"><a class="tsd-kind-icon" href="classes/_lib_transaction_d_.transaction.html">Transaction</a></li>
  <li class="tsd-kind-class"><a class="tsd-kind-icon" href="classes/_lib_query_interface_d_.queryinterface.html">QueryInterface</a></li>
  <li class="tsd-kind-module"><a class="tsd-kind-icon" href="modules/_lib_data_types_d_.html">DataTypes</a></li>
  <li class="tsd-kind-module"><a class="tsd-kind-icon" href="modules/_lib_errors_d_.html">Errors</a></li>
  <li class="tsd-kind-module"><a class="tsd-kind-icon" href="modules/_lib_deferrable_d_.html">Deferrable</a></li>
</ul>

#### Associations
<ul class="tsd-index-list" style="list-style: none">
  <li class="tsd-kind-module"><a class="tsd-kind-icon" href="modules/_lib_associations_belongs_to_many_d_.html">BelongsToMany</a></li>
  <li class="tsd-kind-module"><a class="tsd-kind-icon" href="modules/_lib_associations_belongs_to_many_d_.html">BelongsTo</a></li>
  <li class="tsd-kind-module"><a class="tsd-kind-icon" href="modules/_lib_associations_has_many_d_.html">HasMany</a></li>
  <li class="tsd-kind-module"><a class="tsd-kind-icon" href="modules/_lib_associations_has_one_d_.html">HasOne</a></li>
</ul>

## Example

_User.ts_

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
}, {}, sequelize.modelManager);

// associate
// it is important to import _after_ the model above is already exported so the circular reference works.
import {UserGroup} from './UserGroup';
User.belongsTo(UserGroup, {as: 'group', foreignKey: 'groupId'});
```

_app.ts_

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

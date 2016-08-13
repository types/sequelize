
_Start typing to search_

## API
<ul class="tsd-index-list" style="list-style: none">
  <li class="tsd-kind-interface"><a class="tsd-kind-icon" href="interfaces/sequelize.connection.html">Sequelize</a></li>
  <li class="tsd-kind-interface"><a class="tsd-kind-icon" href="interfaces/sequelize.model.html">Model</a></li>
  <li class="tsd-kind-interface"><a class="tsd-kind-icon" href="interfaces/sequelize.instance.html">Instance</a></li>
  <li class="tsd-kind-interface"><a class="tsd-kind-icon" href="interfaces/sequelize.hooks.html">Hooks</a></li>
  <li class="tsd-kind-interface"><a class="tsd-kind-icon" href="interfaces/sequelize.hooks.html">Associations</a></li>
  <li class="tsd-kind-interface"><a class="tsd-kind-icon" href="interfaces/sequelize.transaction.html">Transaction</a></li>
  <li class="tsd-kind-interface"><a class="tsd-kind-icon" href="interfaces/datatypes.html">DataTypes</a></li>
  <li class="tsd-kind-interface"><a class="tsd-kind-icon" href="interfaces/sequelize.errors.html">Errors</a></li>
  <li class="tsd-kind-interface"><a class="tsd-kind-icon" href="interfaces/sequelize.deferrable.html">Deferrable</a></li>
</ul>

## Example

```ts
// models/Thing.ts
import * as Sequelize from 'sequelize';
import sequelize from '../connection'; // A Sequelize instance

/**
 * Interface used to create/update an instance (passed to create/update)
 */
export interface Thing {
  id?: number;
  name?: string;
}

/**
 * The actual instance class
 */
export interface ThingInstance extends Sequelize.Instance<ThingInstance, Thing> {
  id: number;
  name: string;

  // you should add all instance methods here
  doSomething(): any;
}

/**
 * Your Model
 */
export const Thing = sequelize.define<ThingInstance, Thing>('Thing', {
  name: Sequelize.STRING,
}, {
  instanceMethods: {
    doSomething() {
      // whatever...
    }
  }
});
```

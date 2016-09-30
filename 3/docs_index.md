
_Start typing to search_

## API
<ul class="tsd-index-list" style="list-style: none">
  <li class="tsd-kind-interface"><a class="tsd-kind-icon" href="interfaces/sequelize.connection.html">Sequelize</a></li>
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.model.html">Model</a></li>
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.instance.html">Instance</a></li>
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.hooks.html">Hooks</a></li>
  <li class="tsd-kind-interface"><a class="tsd-kind-icon" href="interfaces/sequelize.associations.html">Associations</a></li>
  <li class="tsd-kind-interface"><a class="tsd-kind-icon" href="interfaces/sequelize.transaction.html">Transaction</a></li>
  <li class="tsd-kind-interface"><a class="tsd-kind-icon" href="interfaces/datatypes.html">DataTypes</a></li>
  <li class="tsd-kind-interface"><a class="tsd-kind-icon" href="interfaces/sequelize.errors.html">Errors</a></li>
  <li class="tsd-kind-interface"><a class="tsd-kind-icon" href="interfaces/sequelize.deferrable.html">Deferrable</a></li>
</ul>

#### Association Mixins

##### BelongsTo
<ul class="tsd-index-list" style="list-style: none">
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.belongstogetassociationmixin.html">getAssociation()</a></li>
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.belongstosetassociationmixin.html">setAssociation()</a></li>
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.belongstocreateassociationmixin.html">createAssociation()</a></li>
</ul>

##### HasOne
<ul class="tsd-index-list" style="list-style: none">
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.hasonegetassociationmixin.html">getAssociation()</a></li>
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.hasonesetassociationmixin.html">setAssociation()</a></li>
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.hasonecreateassociationmixin.html">createAssociation()</a></li>
</ul>

##### HasMany
<ul class="tsd-index-list" style="list-style: none">
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.hasmanygetassociationsmixin.html">getAssociations()</a></li>
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.hasmanysetassociationsmixin.html">setAssociations()</a></li>
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.hasmanyaddassociationmixin.html">addAssociation()</a></li>
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.hasmanycreateassociationmixin.html">createAssociation()</a></li>
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.hasmanyhasassociationmixin.html">hasAssociation()</a></li>
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.hasmanycountassociationsmixin.html">countAssociations()</a></li>
</ul>

##### BelongsToMany
<ul class="tsd-index-list" style="list-style: none">
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.belongstomanygetassociationmixin.html">getAssociations()</a></li>
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.belongstomanysetassociationsmixin.html">setAssociations()</a></li>
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.belongstomanyaddassociationmixin.html">addAssociation()</a></li>
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.belongstomanycreateassociationmixin.html">createAssociation()</a></li>
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.belongstomanyhasassociationmixin.html">hasAssociation()</a></li>
  <li class="tsd-kind-interface tsd-has-type-parameter"><a class="tsd-kind-icon" href="interfaces/sequelize.belongstomanycountassociationsmixin.html">countAssociations()</a></li>
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
